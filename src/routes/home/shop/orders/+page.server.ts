import { error, redirect } from '@sveltejs/kit';
import { canFulfillOrders, getOrCreateUser } from '$lib/server/user';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(303, '/');

	const account = await getOrCreateUser(locals.user);
	if (!canFulfillOrders(account)) throw error(403, 'Fulfillment or administrator access is required.');

	return { perms: account.perms };
};
