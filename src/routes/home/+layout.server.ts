import { redirect } from '@sveltejs/kit';
import { getOrCreateUser } from '$lib/server/user';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(303, '/');

	const dbUser = await getOrCreateUser(locals.user);

	return {
		slackId: locals.user.slackId,
		displayName: locals.user.displayName,
		avatarUrl: locals.user.avatarUrl,
		goldBars: dbUser.clocks,
		user: { ...locals.user, isReviewer: false },
		data: locals.user
	};
};
