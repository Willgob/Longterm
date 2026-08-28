import { fail, redirect } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { shop } from '$lib/server/db/schema';
import { verifyUploadProof } from '$lib/server/uploadthing';
import { getOrCreateUser } from '$lib/server/user';
import type { Actions, PageServerLoad } from './$types';

function readText(data: FormData, key: string) {
	return String(data.get(key) ?? '').trim();
}

function isUploadThingUrl(value: string) {
	try {
		const url = new URL(value);
		return (
			url.protocol === 'https:' &&
			url.hostname.endsWith('.ufs.sh') &&
			url.pathname.startsWith('/f/') &&
			url.pathname.length > 3 &&
			!url.username &&
			!url.password &&
			!url.search &&
			!url.hash
		);
	} catch {
		return false;
	}
}

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(303, '/');
	await getOrCreateUser(locals.user);

	const items = await db
		.select()
		.from(shop)
		.where(eq(shop.slackId, locals.user.slackId))
		.orderBy(desc(shop.createdAt), desc(shop.id));

	return { items };
};

export const actions: Actions = {
	requestItem: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/');
		await getOrCreateUser(locals.user);

		const data = await request.formData();
		const name = readText(data, 'name');
		const description = readText(data, 'description');
		const specification = readText(data, 'specification');
		const imageUrl = readText(data, 'imageUrl');
		const imageKey = readText(data, 'imageKey');
		const imageProof = readText(data, 'imageProof');
		const requestedPriceValue = readText(data, 'requestedPrice');
		const goalDaysValue = readText(data, 'goalDays');
		const requestedPrice = Number(requestedPriceValue);
		const goalDays = Number(goalDaysValue);

		if (name.length < 2 || name.length > 120) {
			return fail(400, { message: 'Product name must be between 2 and 120 characters.' });
		}
		if (!Number.isSafeInteger(requestedPrice) || requestedPrice < 100 || requestedPrice > 10_000_000) {
			return fail(400, { message: 'Price must be a whole USD amount between $100 and $10,000,000.' });
		}
		if (!Number.isSafeInteger(goalDays) || goalDays < 1 || goalDays > 3650) {
			return fail(400, { message: 'Goal must be between 1 and 3,650 days.' });
		}
		if (description.length < 3 || description.length > 2_000) {
			return fail(400, { message: 'Description must be between 3 and 2,000 characters.' });
		}
		if (specification.length > 1_000) {
			return fail(400, { message: 'Specification must be 1,000 characters or fewer.' });
		}
		if (
			imageUrl.length > 2_048 ||
			imageKey.length > 512 ||
			imageProof.length > 128 ||
			!isUploadThingUrl(imageUrl) ||
			!imageKey ||
			!imageProof ||
			!verifyUploadProof(locals.user.slackId, imageUrl, imageKey, imageProof)
		) {
			return fail(400, { message: 'Upload a valid product image before submitting.' });
		}

		const now = Math.floor(Date.now() / 1000);

		await db.insert(shop).values({
			slackId: locals.user.slackId,
			name,
			description,
			specification,
			imageUrl,
			goalDays,
			requestedPrice,
			currency: 'USD',
			status: 'pending',
			createdAt: now,
			updatedAt: now
		});

		throw redirect(303, '/home/shop?requested=1');
	}
};
