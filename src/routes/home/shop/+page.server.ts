import { fail, redirect } from '@sveltejs/kit';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { shop, shopImage } from '$lib/server/db/schema';
import { getOrCreateUser } from '$lib/server/user';
import type { Actions, PageServerLoad } from './$types';

function readText(data: FormData, key: string) {
	return String(data.get(key) ?? '').trim();
}

function isHttpUrl(value: string) {
	try {
		const url = new URL(value);
		return url.protocol === 'http:' || url.protocol === 'https:';
	} catch {
		return false;
	}
}

const allowedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']);
const maxImageSize = 5 * 1024 * 1024;

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(303, '/');
	await getOrCreateUser(locals.user);

	const items = await db
		.select({
			...getTableColumns(shop),
			hasUploadedImage: sql<boolean>`${shopImage.shopId} is not null`
		})
		.from(shop)
		.leftJoin(shopImage, eq(shop.id, shopImage.shopId))
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
		const imageEntry = data.get('imageFile');
		const imageFile = imageEntry instanceof File && imageEntry.size > 0 ? imageEntry : null;
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
		if (imageFile && !allowedImageTypes.has(imageFile.type)) {
			return fail(400, { message: 'Upload a JPEG, PNG, WebP, GIF, or AVIF image.' });
		}
		if (imageFile && imageFile.size > maxImageSize) {
			return fail(400, { message: 'The uploaded image must be 5 MB or smaller.' });
		}
		if (imageFile && imageFile.name.length > 255) {
			return fail(400, { message: 'The uploaded image filename is too long.' });
		}
		if (!imageFile && (imageUrl.length > 2_048 || !isHttpUrl(imageUrl))) {
			return fail(400, { message: 'Upload an image or enter a valid http(s) image URL.' });
		}

		const now = Math.floor(Date.now() / 1000);
		const imageBytes = imageFile ? new Uint8Array(await imageFile.arrayBuffer()) : null;

		await db.transaction(async (tx) => {
			const [createdItem] = await tx
				.insert(shop)
				.values({
					slackId: locals.user!.slackId,
					name,
					description,
					specification,
					imageUrl: imageFile ? '' : imageUrl,
					goalDays,
					requestedPrice,
					currency: 'USD',
					status: 'pending',
					createdAt: now,
					updatedAt: now
				})
				.returning({ id: shop.id });

			if (imageFile && imageBytes) {
				await tx.insert(shopImage).values({
					shopId: createdItem.id,
					data: imageBytes,
					mimeType: imageFile.type,
					fileName: imageFile.name,
					size: imageFile.size,
					createdAt: now
				});
			}
		});

		throw redirect(303, '/home/shop?requested=1');
	}
};
