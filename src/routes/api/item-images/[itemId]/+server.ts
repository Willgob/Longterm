import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { shopImage } from '$lib/server/db/schema';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals }) => {
	if (!locals.user) return new Response('Unauthorized', { status: 401 });

	const itemId = Number(params.itemId);
	if (!Number.isSafeInteger(itemId) || itemId < 1) {
		return new Response('Invalid item image', { status: 400 });
	}

	const [image] = await db
		.select({ data: shopImage.data, mimeType: shopImage.mimeType, size: shopImage.size })
		.from(shopImage)
		.where(eq(shopImage.shopId, itemId))
		.limit(1);

	if (!image) return new Response('Image not found', { status: 404 });

	return new Response(new Uint8Array(image.data), {
		headers: {
			'Content-Type': image.mimeType,
			'Content-Length': String(image.size),
			'Cache-Control': 'private, max-age=86400',
			'X-Content-Type-Options': 'nosniff'
		}
	});
};
