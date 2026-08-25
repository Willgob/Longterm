import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals }) => {
	if (!locals.user) throw redirect(303, '/');

	console.log(locals.user)
	return {
		slackId: locals.user.slackId,
		displayName: locals.user.displayName,
		avatarUrl: locals.user.avatarUrl,
		Clocks: 0,
		user: { isReviewer: false },
		data: locals.user
	};
};
