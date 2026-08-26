import { redirect } from '@sveltejs/kit';
import { canReviewItems, getAccessState, getOrCreateUser } from '$lib/server/user';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(303, '/');

	const dbUser = await getOrCreateUser(locals.user);
	const access = getAccessState(dbUser);

	return {
		slackId: locals.user.slackId,
		displayName: locals.user.displayName,
		avatarUrl: locals.user.avatarUrl,
		goldBars: dbUser.clocks,
		strikes: dbUser.strikes,
		access,
		user: { ...locals.user, perms: dbUser.perms, isReviewer: canReviewItems(dbUser) },
		data: locals.user
	};
};
