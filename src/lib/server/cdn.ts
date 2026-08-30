import { env } from '$env/dynamic/private';

const cdnUploadUrl = 'https://cdn.hackclub.com/api/v4/upload';
const maxImageSize = 4 * 1024 * 1024;

type CdnUploadResponse = {
	id?: string;
	url?: string;
	error?: string;
};

export type UploadedImage = {
	id: string;
	url: string;
};

export function validateProductImage(image: FormDataEntryValue | null) {
	if (!(image instanceof File) || image.size === 0) {
		return 'Choose a product image before submitting.';
	}

	if (!image.type.startsWith('image/')) {
		return 'The product image must be an image file.';
	}

	if (image.size > maxImageSize) {
		return 'The product image must be 4 MB or smaller.';
	}

	return undefined;
}

function isHackClubCdnUrl(value: string) {
	try {
		const url = new URL(value);
		return (
			url.protocol === 'https:' &&
			url.hostname === 'cdn.hackclub.com' &&
			url.pathname.length > 1 &&
			!url.username &&
			!url.password &&
			!url.search &&
			!url.hash
		);
	} catch {
		return false;
	}
}

export async function uploadProductImage(image: File, fetcher: typeof fetch): Promise<UploadedImage> {
	if (!env.HACKCLUB_CDN_API_KEY) {
		throw new Error('HACKCLUB_CDN_API_KEY is not configured.');
	}

	const formData = new FormData();
	formData.set('file', image, image.name);

	const response = await fetcher(cdnUploadUrl, {
		method: 'POST',
		headers: { Authorization: `Bearer ${env.HACKCLUB_CDN_API_KEY}` },
		body: formData
	});
	const body = (await response.json().catch(() => ({}))) as CdnUploadResponse;

	if (!response.ok || !body.id || !body.url || !isHackClubCdnUrl(body.url)) {
		throw new Error(body.error || 'The image upload failed. Please try again.');
	}

	return { id: body.id, url: body.url };
}

export async function deleteUploadedImage(id: string, fetcher: typeof fetch) {
	if (!env.HACKCLUB_CDN_API_KEY) return;

	await fetcher(`${cdnUploadUrl}/${encodeURIComponent(id)}`, {
		method: 'DELETE',
		headers: { Authorization: `Bearer ${env.HACKCLUB_CDN_API_KEY}` }
	});
}
