import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';

type AuthenticatedUser = NonNullable<App.Locals['user']>;

export async function getOrCreateUser(authenticatedUser: AuthenticatedUser) {
	const [existingUser] = await db
		.select()
		.from(user)
		.where(eq(user.slackId, authenticatedUser.slackId))
		.limit(1);

	const now = Math.floor(Date.now() / 1000);

	if (existingUser) {
		const verified = authenticatedUser.verificationStatus === 'verified' ? 1 : 0;
		const profileChanged =
			existingUser.email !== authenticatedUser.email ||
			existingUser.displayName !== authenticatedUser.displayName ||
			existingUser.avatarUrl !== authenticatedUser.avatarUrl ||
			existingUser.verified !== verified;

		if (!profileChanged) return existingUser;

		const [updatedUser] = await db
			.update(user)
			.set({
				email: authenticatedUser.email,
				displayName: authenticatedUser.displayName,
				avatarUrl: authenticatedUser.avatarUrl,
				verified,
				updatedAt: now
			})
			.where(eq(user.slackId, authenticatedUser.slackId))
			.returning();

		return updatedUser ?? existingUser;
	}

	const [createdUser] = await db
		.insert(user)
		.values({
			slackId: authenticatedUser.slackId,
			email: authenticatedUser.email,
			displayName: authenticatedUser.displayName,
			avatarUrl: authenticatedUser.avatarUrl,
			clocks: 0,
			strikes: 0,
			verified: authenticatedUser.verificationStatus === 'verified' ? 1 : 0,
			createdAt: now,
			updatedAt: now
		})
		.onConflictDoNothing()
		.returning();

	if (createdUser) return createdUser;

	const [userCreatedByAnotherRequest] = await db
		.select()
		.from(user)
		.where(eq(user.slackId, authenticatedUser.slackId))
		.limit(1);

	if (!userCreatedByAnotherRequest) throw new Error('Could not create the authenticated user');
	return userCreatedByAnotherRequest;
}
