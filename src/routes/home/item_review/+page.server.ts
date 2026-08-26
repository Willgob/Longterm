import { error, fail, redirect } from '@sveltejs/kit';
import { and, asc, desc, eq, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { shop, shopImage, strike, user } from '$lib/server/db/schema';
import { getOrCreateUser } from '$lib/server/user';
import type { Actions, PageServerLoad } from './$types';

const reviewStatuses = ['pending', 'approved', 'changes_requested', 'rejected'] as const;
type ReviewStatus = (typeof reviewStatuses)[number];

function isReviewStatus(value: string | null): value is ReviewStatus {
	return reviewStatuses.includes(value as ReviewStatus);
}

async function requireReviewer(locals: App.Locals) {
	if (!locals.user) throw redirect(303, '/');

	const reviewer = await getOrCreateUser(locals.user);
	if (reviewer.isReviewer !== 1) throw error(403, 'You do not have permission to review items.');

	return reviewer;
}

function readItemId(data: FormData) {
	const itemId = Number(data.get('itemId'));
	return Number.isSafeInteger(itemId) && itemId > 0 ? itemId : null;
}

function readNotes(data: FormData) {
	return String(data.get('reviewNotes') ?? '').trim();
}

export const load: PageServerLoad = async ({ locals, url }) => {
	await requireReviewer(locals);

	const requestedStatus = url.searchParams.get('status');
	const selectedStatus: ReviewStatus = isReviewStatus(requestedStatus) ? requestedStatus : 'pending';

	const [items, countRows] = await Promise.all([
		db
			.select({
				id: shop.id,
				name: shop.name,
				description: shop.description,
				specification: shop.specification,
				imageUrl: shop.imageUrl,
				hasUploadedImage: sql<boolean>`${shopImage.shopId} is not null`,
				goalDays: shop.goalDays,
				requestedPrice: shop.requestedPrice,
				currency: shop.currency,
				status: shop.status,
				price: shop.price,
				reviewNotes: shop.reviewNotes,
				reviewedBy: shop.reviewedBy,
				reviewedAt: shop.reviewedAt,
				createdAt: shop.createdAt,
				requesterSlackId: shop.slackId,
				requestedBy: user.displayName,
				requesterAvatarUrl: user.avatarUrl,
				requesterStrikes: user.strikes
			})
			.from(shop)
			.innerJoin(user, eq(shop.slackId, user.slackId))
			.leftJoin(shopImage, eq(shop.id, shopImage.shopId))
			.where(eq(shop.status, selectedStatus))
			.orderBy(selectedStatus === 'pending' ? asc(shop.createdAt) : desc(shop.updatedAt), asc(shop.id))
			.limit(1),
		db
			.select({ status: shop.status, count: sql<number>`count(*)::int` })
			.from(shop)
			.groupBy(shop.status)
	]);

	const counts: Record<ReviewStatus, number> = {
		pending: 0,
		approved: 0,
		changes_requested: 0,
		rejected: 0
	};

	for (const row of countRows) {
		if (isReviewStatus(row.status)) counts[row.status] = Number(row.count);
	}

	return { item: items[0] ?? null, counts, selectedStatus };
};

export const actions: Actions = {
	approve: async ({ request, locals }) => {
		const reviewer = await requireReviewer(locals);
		const data = await request.formData();
		const itemId = readItemId(data);
		const finalPriceValue = data.get('finalPrice');
		const finalPrice = Number(finalPriceValue);
		const reviewNotes = readNotes(data);

		if (!itemId) return fail(400, { message: 'That item request is invalid.' });
		if (reviewNotes.length > 2_000) return fail(400, { message: 'Review notes must be 2,000 characters or fewer.' });
		if (typeof finalPriceValue !== 'string' || finalPriceValue.trim() === '' || !Number.isSafeInteger(finalPrice) || finalPrice < 0) {
			return fail(400, { message: 'Enter a valid whole-dollar final price.' });
		}

		const now = Math.floor(Date.now() / 1000);
		const [approved] = await db
			.update(shop)
			.set({
				status: 'approved',
				price: finalPrice,
				reviewNotes: reviewNotes || null,
				reviewedBy: reviewer.slackId,
				reviewedAt: now,
				updatedAt: now
			})
			.where(and(eq(shop.id, itemId), eq(shop.status, 'pending')))
			.returning({ id: shop.id });

		if (!approved) return fail(409, { message: 'This item has already been reviewed.' });
		throw redirect(303, '/home/item_review?result=approved');
	},

	requestChanges: async ({ request, locals }) => {
		const reviewer = await requireReviewer(locals);
		const data = await request.formData();
		const itemId = readItemId(data);
		const reviewNotes = readNotes(data);

		if (!itemId) return fail(400, { message: 'That item request is invalid.' });
		if (reviewNotes.length < 3) {
			return fail(400, { message: 'Explain what the requester needs to change.' });
		}
		if (reviewNotes.length > 2_000) return fail(400, { message: 'Review notes must be 2,000 characters or fewer.' });

		const now = Math.floor(Date.now() / 1000);
		const [changed] = await db
			.update(shop)
			.set({
				status: 'changes_requested',
				price: null,
				reviewNotes,
				reviewedBy: reviewer.slackId,
				reviewedAt: now,
				updatedAt: now
			})
			.where(and(eq(shop.id, itemId), eq(shop.status, 'pending')))
			.returning({ id: shop.id });

		if (!changed) return fail(409, { message: 'This item has already been reviewed.' });
		throw redirect(303, '/home/item_review?result=changes-requested');
	},

	reject: async ({ request, locals }) => {
		const reviewer = await requireReviewer(locals);
		const data = await request.formData();
		const itemId = readItemId(data);
		const reviewNotes = readNotes(data);

		if (!itemId) return fail(400, { message: 'That item request is invalid.' });
		if (reviewNotes.length > 2_000) return fail(400, { message: 'Review notes must be 2,000 characters or fewer.' });

		const now = Math.floor(Date.now() / 1000);
		const rejected = await db.transaction(async (tx) => {
			const [reviewedItem] = await tx
				.update(shop)
				.set({
					status: 'rejected',
					price: null,
					reviewNotes: reviewNotes || null,
					reviewedBy: reviewer.slackId,
					reviewedAt: now,
					updatedAt: now
				})
				.where(and(eq(shop.id, itemId), eq(shop.status, 'pending')))
				.returning({ requesterSlackId: shop.slackId });

			if (!reviewedItem) return false;

			const [strikeCreated] = await tx
				.insert(strike)
				.values({
					slackId: reviewedItem.requesterSlackId,
					shopId: itemId,
					reason: reviewNotes || null,
					createdBy: reviewer.slackId,
					createdAt: now
				})
				.onConflictDoNothing({ target: strike.shopId })
				.returning({ id: strike.id });

			if (!strikeCreated) throw new Error('A strike already exists for this item request.');

			await tx
				.update(user)
				.set({ strikes: sql`${user.strikes} + 1`, updatedAt: now })
				.where(eq(user.slackId, reviewedItem.requesterSlackId));

			return true;
		});

		if (!rejected) return fail(409, { message: 'This item has already been reviewed.' });
		throw redirect(303, '/home/item_review?result=rejected');
	}
};
