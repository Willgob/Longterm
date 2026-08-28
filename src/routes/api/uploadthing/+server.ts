import { env } from '$env/dynamic/private';
import { ourFileRouter, uploadUserHeader } from '$lib/server/uploadthing';
import { getAccessState } from '$lib/server/user';
import { createRouteHandler } from 'uploadthing/server';
import type { RequestHandler } from './$types';

const handlers = createRouteHandler({
	router: ourFileRouter,
	config: {
		token: env.UPLOADTHING_TOKEN
	}
});

const handleUploadThingRequest: RequestHandler = ({ request, locals }) => {
	const headers = new Headers(request.headers);
	headers.delete(uploadUserHeader);

	if (locals.user && locals.account) {
		const access = getAccessState(locals.account);
		if (!access.shopBanActive && !access.programBanActive) {
			headers.set(uploadUserHeader, locals.user.slackId);
		}
	}

	return handlers(new Request(request, { headers }));
};

export { handleUploadThingRequest as GET, handleUploadThingRequest as POST };
