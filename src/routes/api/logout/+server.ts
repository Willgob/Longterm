import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ cookies }) => {
	for (const name of ['hca_access_token', 'hca_refresh_token', 'hca_session', 'hca_oauth_state']) {
		cookies.delete(name, { path: '/' });
	}

	throw redirect(303, '/');
};
