import { redirect } from '@sveltejs/kit';
import { getAccessState } from '$lib/server/user';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	if (!locals.user || !locals.account) throw redirect(303, '/');
	return { displayName: locals.user.displayName, access: getAccessState(locals.account) };
};
