import { createHmac, timingSafeEqual } from 'node:crypto';
import { env } from '$env/dynamic/private';
import type { FileRouter } from 'uploadthing/server';
import { createUploadthing, UploadThingError } from 'uploadthing/server';

export const uploadUserHeader = 'x-longterm-upload-user';

const upload = createUploadthing();

function createUploadProof(userId: string, ufsUrl: string, key: string) {
	return createHmac('sha256', env.UPLOADTHING_TOKEN)
		.update(`${userId}\0${ufsUrl}\0${key}`)
		.digest('base64url');
}

export function verifyUploadProof(userId: string, ufsUrl: string, key: string, proof: string) {
	const expectedProof = createUploadProof(userId, ufsUrl, key);
	const expectedBytes = Buffer.from(expectedProof);
	const providedBytes = Buffer.from(proof);

	return expectedBytes.length === providedBytes.length && timingSafeEqual(expectedBytes, providedBytes);
}

export const ourFileRouter = {
	imageUploader: upload({
		image: {
			maxFileSize: '4MB',
			maxFileCount: 1
		}
	})
		.middleware(({ req }) => {
			const userId = req.headers.get(uploadUserHeader);
			if (!userId) {
				throw new UploadThingError({
					code: 'FORBIDDEN',
					message: 'You must be signed in and allowed to use the shop to upload an image.'
				});
			}

			return { userId };
		})
		.onUploadComplete(({ metadata, file }) => ({
			ufsUrl: file.ufsUrl,
			key: file.key,
			proof: createUploadProof(metadata.userId, file.ufsUrl, file.key)
		}))
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
