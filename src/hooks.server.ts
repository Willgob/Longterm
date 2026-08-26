import { dev } from '$app/environment';
import { HCA_CLIENT_ID, HCA_CLIENT_SECRET } from '$env/static/private';
import { redirect, type Handle } from '@sveltejs/kit';
import { getAccessState, getOrCreateUser, isAdmin } from '$lib/server/user';

type HcaIdentity = {
	id?: string;
	slack_id?: string;
	primary_email?: string;
	first_name?: string;
	last_name?: string;
	verification_status?: string;
	avatar_url?: string;
};

type HcaMeResponse = {
	identity?: HcaIdentity;
};

type HcaTokens = {
	access_token?: string;
	refresh_token?: string;
	expires_in?: number;
};

const accessTokenMaxAge = 60 * 60;
const refreshTokenMaxAge = 60 * 60 * 24 * 180;

async function getUser(fetcher: typeof fetch, accessToken: string) {
	const response = await fetcher('https://auth.hackclub.com/api/v1/me', {
		headers: { Authorization: `Bearer ${accessToken}` }
	});

	if (!response.ok) return undefined;

	const { identity }: HcaMeResponse = await response.json();
	if (!identity?.id) return undefined;

	const displayName = [identity.first_name, identity.last_name].filter(Boolean).join(' ') || 'Hack Clubber';

	return {
		identityId: identity.id,
		slackId: identity.slack_id ?? identity.id,
		email: identity.primary_email ?? '',
		displayName,
		avatarUrl: identity.avatar_url ?? '',
		verificationStatus: identity.verification_status ?? ''
	};
}

async function refreshAccessToken(fetcher: typeof fetch, refreshToken: string) {
	const response = await fetcher('https://auth.hackclub.com/oauth/token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			client_id: HCA_CLIENT_ID,
			client_secret: HCA_CLIENT_SECRET,
			refresh_token: refreshToken,
			grant_type: 'refresh_token'
		})
	});

	if (!response.ok) return undefined;
	return (await response.json()) as HcaTokens;
}

export const handle: Handle = async ({ event, resolve }) => {
	let accessToken = event.cookies.get('hca_access_token');
	let user;

	if (accessToken) {
		try {
			user = await getUser(event.fetch, accessToken);
		} catch {
			user = undefined;
		}
	}

	if (!user) {
		const refreshToken = event.cookies.get('hca_refresh_token');
		if (refreshToken) {
			try {
				const tokens = await refreshAccessToken(event.fetch, refreshToken);
				if (tokens?.access_token) {
					accessToken = tokens.access_token;
					event.cookies.set('hca_access_token', accessToken, {
						path: '/', httpOnly: true, secure: !dev, sameSite: 'lax', maxAge: Math.min(tokens.expires_in ?? accessTokenMaxAge, accessTokenMaxAge)
					});
					if (tokens.refresh_token) {
						event.cookies.set('hca_refresh_token', tokens.refresh_token, {
							path: '/', httpOnly: true, secure: !dev, sameSite: 'lax', maxAge: refreshTokenMaxAge
						});
					}
					user = await getUser(event.fetch, accessToken);
				}
			} catch {
				user = undefined;
			}
		}
	}

	if (!user && accessToken) event.cookies.delete('hca_access_token', { path: '/' });
	if (!user && event.cookies.get('hca_refresh_token')) event.cookies.delete('hca_refresh_token', { path: '/' });

	event.locals.user = user;
	event.locals.account = undefined;

	if (user) {
		const account = await getOrCreateUser(user);
		event.locals.account = {
			perms: account.perms,
			strikes: account.strikes,
			strikeUpdatedAt: account.strikeUpdatedAt,
			isReviewer: account.isReviewer
		};

		const access = getAccessState(account);
		const isAuthenticationRoute = event.url.pathname.startsWith('/api/login') || event.url.pathname === '/api/logout';

		if (!isAdmin(account) && access.programBanActive && event.url.pathname !== '/banned' && !isAuthenticationRoute) {
			throw redirect(303, '/banned');
		}

		if (!isAdmin(account) && access.shopBanActive && event.url.pathname.startsWith('/home/shop')) {
			throw redirect(303, '/banned?scope=shop');
		}
	}

	if (event.url.pathname.startsWith('/home') && !user) {
		throw redirect(303, '/');
	}

	return resolve(event);
};
