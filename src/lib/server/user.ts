import { eq } from 'drizzle-orm';
import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { permissionValues, user } from '$lib/server/db/schema';

type AuthenticatedUser = NonNullable<App.Locals['user']>;
type DatabaseUser = typeof user.$inferSelect;

export type UserPermission = (typeof permissionValues)[number];
export const permissions = permissionValues;
export const weekInSeconds = 7 * 24 * 60 * 60;

export type AccessState = {
	perms: UserPermission[];
	strikes: number;
	strikeUpdatedAt: number | null;
	shopBannedUntil: number | null;
	programBannedUntil: number | null;
	shopBanActive: boolean;
	programBanActive: boolean;
	programBanPermanent: boolean;
};

function nowInSeconds() {
	return Math.floor(Date.now() / 1000);
}

function bootstrapAdminSlackIds() {
	return new Set((env.ADMIN_SLACK_IDS ?? '').split(',').map((id) => id.trim()).filter(Boolean));
}

function shouldBeBootstrapAdmin(slackId: string) {
	return bootstrapAdminSlackIds().has(slackId);
}

export function hasPermission(account: Pick<DatabaseUser, 'perms'>, permission: UserPermission) {
	return account.perms.includes('admin') || account.perms.includes(permission);
}

export function isAdmin(account: Pick<DatabaseUser, 'perms'>) {
	return account.perms.includes('admin');
}

export function canReviewItems(account: Pick<DatabaseUser, 'perms'>) {
	return hasPermission(account, 'item-review');
}

export function canFulfillOrders(account: Pick<DatabaseUser, 'perms'>) {
	return hasPermission(account, 'fulfillment');
}

export function getAccessState(
	account: Pick<DatabaseUser, 'perms' | 'strikes' | 'strikeUpdatedAt'>,
	now = nowInSeconds()
): AccessState {
	const banEndsAt = account.strikeUpdatedAt === null ? null : account.strikeUpdatedAt + weekInSeconds;
	const shopBanActive = account.strikes === 2 && banEndsAt !== null && banEndsAt > now;
	const programBanPermanent = account.strikes >= 4;
	const programBanActive = programBanPermanent || (account.strikes === 3 && banEndsAt !== null && banEndsAt > now);

	return {
		perms: account.perms,
		strikes: account.strikes,
		strikeUpdatedAt: account.strikeUpdatedAt,
		shopBannedUntil: shopBanActive ? banEndsAt : null,
		programBannedUntil: account.strikes === 3 && programBanActive ? banEndsAt : null,
		shopBanActive,
		programBanActive,
		programBanPermanent
	};
}

export async function getOrCreateUser(authenticatedUser: AuthenticatedUser) {
	const [existingUser] = await db.select().from(user).where(eq(user.slackId, authenticatedUser.slackId)).limit(1);
	const now = nowInSeconds();

	if (existingUser) {
		const verified = authenticatedUser.verificationStatus === 'verified' ? 1 : 0;
		const perms = shouldBeBootstrapAdmin(authenticatedUser.slackId)
			? [...new Set<UserPermission>([...existingUser.perms, 'admin'])]
			: existingUser.perms;
		const permissionsChanged = perms.some((permission) => !existingUser.perms.includes(permission));
		const profileChanged = existingUser.email !== authenticatedUser.email || existingUser.displayName !== authenticatedUser.displayName || existingUser.avatarUrl !== authenticatedUser.avatarUrl || existingUser.verified !== verified || permissionsChanged;
		if (!profileChanged) return existingUser;

		const [updatedUser] = await db.update(user).set({ email: authenticatedUser.email, displayName: authenticatedUser.displayName, avatarUrl: authenticatedUser.avatarUrl, verified, perms, updatedAt: now }).where(eq(user.slackId, authenticatedUser.slackId)).returning();
		return updatedUser ?? existingUser;
	}

	const [createdUser] = await db.insert(user).values({
		slackId: authenticatedUser.slackId,
		email: authenticatedUser.email,
		displayName: authenticatedUser.displayName,
		avatarUrl: authenticatedUser.avatarUrl,
		clocks: 0,
		strikes: 0,
		perms: shouldBeBootstrapAdmin(authenticatedUser.slackId) ? ['admin', 'user'] : ['user'],
		verified: authenticatedUser.verificationStatus === 'verified' ? 1 : 0,
		createdAt: now,
		updatedAt: now
	}).onConflictDoNothing().returning();

	if (createdUser) return createdUser;
	const [userCreatedByAnotherRequest] = await db.select().from(user).where(eq(user.slackId, authenticatedUser.slackId)).limit(1);
	if (!userCreatedByAnotherRequest) throw new Error('Could not create the authenticated user');
	return userCreatedByAnotherRequest;
}

export async function addStrike(slackId: string) {
	const [targetUser] = await db.select().from(user).where(eq(user.slackId, slackId)).limit(1);
	if (!targetUser) throw new Error('The strike recipient does not exist');

	const [updatedUser] = await db.update(user).set({
		strikes: Math.min(targetUser.strikes + 1, 4),
		strikeUpdatedAt: nowInSeconds(),
		updatedAt: nowInSeconds()
	}).where(eq(user.slackId, slackId)).returning();
	return updatedUser;
}

export async function removeStrike(slackId: string) {
	const [targetUser] = await db.select().from(user).where(eq(user.slackId, slackId)).limit(1);
	if (!targetUser) return undefined;

	const [updatedUser] = await db.update(user).set({
		strikes: Math.max(0, targetUser.strikes - 1),
		updatedAt: nowInSeconds()
	}).where(eq(user.slackId, slackId)).returning();
	return updatedUser;
}

export async function overturnBan(slackId: string, scope: 'shop' | 'program') {
	const [targetUser] = await db.select().from(user).where(eq(user.slackId, slackId)).limit(1);
	if (!targetUser) return undefined;

	const [updatedUser] = await db.update(user).set({
		strikes: scope === 'program' && targetUser.strikes === 4 ? 3 : targetUser.strikes,
		strikeUpdatedAt: null,
		updatedAt: nowInSeconds()
	}).where(eq(user.slackId, slackId)).returning();
	return updatedUser;
}

export async function setUserPermissions(slackId: string, perms: UserPermission[]) {
	const [updatedUser] = await db.update(user).set({ perms, updatedAt: nowInSeconds() }).where(eq(user.slackId, slackId)).returning();
	return updatedUser;
}
