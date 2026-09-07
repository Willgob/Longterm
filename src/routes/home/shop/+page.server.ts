import { fail, redirect } from '@sveltejs/kit';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { shop, user } from '$lib/server/db/schema';
import { deleteUploadedImage, uploadProductImage, validateProductImage } from '$lib/server/cdn';
import { getOrCreateUser } from '$lib/server/user';
import type { Actions, PageServerLoad } from './$types';

function readText(data: FormData, key: string) {
	return String(data.get(key) ?? '').trim();
}

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(303, '/');
	const account = await getOrCreateUser(locals.user);

	const items = await db
		.select()
		.from(shop)
		.where(eq(shop.slackId, locals.user.slackId))
		.orderBy(desc(shop.createdAt), desc(shop.id));

	return { items, progressItemId: account.progressItem };
};

export const actions: Actions = {
	requestItem: async ({ request, locals, fetch }) => {
		if (!locals.user) throw redirect(303, '/');
		await getOrCreateUser(locals.user);

		const data = await request.formData();
		const name = readText(data, 'name');
		const description = readText(data, 'description');
		const specification = readText(data, 'specification');
		const image = data.get('image');
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
		const imageError = validateProductImage(image);
		if (imageError || !(image instanceof File)) {
			return fail(400, { message: imageError ?? 'Choose a product image before submitting.' });
		}

		let uploadedImage;
		try {
			uploadedImage = await uploadProductImage(image, fetch);
		} catch (error) {
			console.error('Failed to upload product image to the Hack Club CDN.', error);
			return fail(502, { message: 'The product image could not be uploaded. Please try again.' });
		}

		const now = Math.floor(Date.now() / 1000);

		try {
			await db.insert(shop).values({
				slackId: locals.user.slackId,
				name,
				description,
				specification,
				imageUrl: uploadedImage.url,
				goalDays,
				requestedPrice,
				currency: 'USD',
				status: 'pending',
				createdAt: now,
				updatedAt: now
			});
		} catch (error) {
			console.error('Failed to save product request after image upload.', error);
			await deleteUploadedImage(uploadedImage.id, fetch).catch((cleanupError) =>
				console.error('Failed to remove an orphaned Hack Club CDN upload.', cleanupError)
			);
			return fail(500, { message: 'The product request could not be saved. Please try again.' });
		}

		throw redirect(303, '/home/shop?requested=1');
	},

	changeProgressItem: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/');
		await getOrCreateUser(locals.user);

		const formData = await request.formData();
		const progressItemId = Number(formData.get('progressItemId'));

		if (!Number.isSafeInteger(progressItemId)) {
			return fail(400, { progressError: 'Choose a valid shop item.' });
		}

		const [selectedItem] = await db
			.select({ id: shop.id })
			.from(shop)
			.where(
				and(
					eq(shop.id, progressItemId),
					eq(shop.slackId, locals.user.slackId),
					eq(shop.status, 'approved')
				)
			)
			.limit(1);

		if (!selectedItem) {
			return fail(400, { progressError: 'You can only track one of your approved items.' });
		}

		await db
			.update(user)
			.set({
				progressItem: selectedItem.id,
				updatedAt: Math.floor(Date.now() / 1000)
			})
			.where(eq(user.slackId, locals.user.slackId));

		return { progressChanged: true };
	}
};
