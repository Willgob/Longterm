// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user?: {
				identityId: string;
				slackId: string;
				email: string;
				displayName: string;
				avatarUrl: string;
				verificationStatus: string;
			};
			account?: {
				perms: 'user' | 'admin' | 'fulfillment' | 'item-review';
				strikes: number;
				strikeUpdatedAt: number | null;
				isReviewer: number;
			};
		}
		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
