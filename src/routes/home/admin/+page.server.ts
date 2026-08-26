import { error, fail, redirect } from '@sveltejs/kit';
import { desc } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { addStrike, isAdmin, overturnBan, permissions, removeStrike, setUserPermission } from '$lib/server/user';
import type { Actions, PageServerLoad } from './$types';

async function requireAdmin(locals: App.Locals) {
	if (!locals.user) throw redirect(303, '/');
	if (!locals.account || !isAdmin(locals.account)) throw error(403, 'Administrator access is required.');
	return locals.user;
}

function formText(data: FormData, name: string) {
	return String(data.get(name) ?? '').trim();
}

export const load: PageServerLoad = async ({ locals }) => {
	await requireAdmin(locals);
	const users = await db.select().from(user).orderBy(desc(user.strikes), user.displayName);
	return { users, permissions };
};

export const actions: Actions = {
	issueStrike: async ({ request, locals }) => {
		const admin = await requireAdmin(locals);
		const data = await request.formData();
		const slackId = formText(data, 'slackId');

		if (!slackId) return fail(400, { message: 'Choose a user before issuing a strike.' });

		try {
			await addStrike(slackId);
		} catch (cause) {
			console.error('Could not issue strike:', cause);
			return fail(400, { message: 'Could not issue that strike.' });
		}

		throw redirect(303, '/home/admin?result=strike-issued');
	},

	removeStrike: async ({ request, locals }) => {
		await requireAdmin(locals);
		const data = await request.formData();
		const slackId = formText(data, 'slackId');
		if (!slackId) return fail(400, { message: 'Choose a user before removing a strike.' });

		const updated = await removeStrike(slackId);
		if (!updated) return fail(404, { message: 'That user no longer exists.' });
		throw redirect(303, '/home/admin?result=strike-removed');
	},

	overturnBan: async ({ request, locals }) => {
		await requireAdmin(locals);
		const data = await request.formData();
		const slackId = formText(data, 'slackId');
		const scope = formText(data, 'scope');
		if (!slackId || (scope !== 'shop' && scope !== 'program')) return fail(400, { message: 'That ban is invalid.' });

		const updated = await overturnBan(slackId, scope);
		if (!updated) return fail(404, { message: 'That user no longer exists.' });
		throw redirect(303, '/home/admin?result=ban-overturned');
	},

	setPermission: async ({ request, locals }) => {
		await requireAdmin(locals);
		const data = await request.formData();
		const slackId = formText(data, 'slackId');
		const perms = formText(data, 'perms');
		if (!slackId || !permissions.includes(perms as (typeof permissions)[number])) {
			return fail(400, { message: 'Choose a valid user and permission.' });
		}

		const updated = await setUserPermission(slackId, perms as (typeof permissions)[number]);
		if (!updated) return fail(404, { message: 'That user no longer exists.' });
		throw redirect(303, '/home/admin?result=permission-updated');
	}
};
