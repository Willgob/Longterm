import { redirect } from "@sveltejs/kit";
import { dev } from "$app/environment";
import { env } from "$env/dynamic/private";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url, cookies, fetch }) => {
    const oauthError = url.searchParams.get("error");
    if (oauthError) {
        console.error("Hackatime returned an error:", oauthError);
        const description = url.searchParams.get("error_description");
        return new Response(`Login failed: ${description ?? oauthError}`, { status: 400 });
    }

    const authCode = url.searchParams.get("code");
    if (!authCode) {
        return new Response("Missing authorization code. Start the login flow from /api/hackatime.", { status: 400 });
    }

    const expectedState = cookies.get("hackatime_oauth_state");
    cookies.delete("hackatime_oauth_state", { path: "/" });
    const state = url.searchParams.get("state");
    if (!state || !expectedState || state !== expectedState) {
        return new Response("Invalid state parameter", { status: 400 });
    }

    // Token exchange
    let tokenResponse;
    try {
        const tokenParams = new URLSearchParams({
            client_id: env.HACKATIME_CLIENT_ID ?? "",
            client_secret: env.HACKATIME_CLIENT_SECRET ?? "",
            code: authCode,
            redirect_uri: `${env.HACKATIME_REDIRECT_ADDRESS ?? ""}/api/hackatime/callback`,
            grant_type: "authorization_code"
        });

        tokenResponse = await fetch("https://hackatime.hackclub.com/oauth/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: tokenParams
        });
    } catch (error) {
        console.error("Error fetching access token:", error);
        return new Response("Error fetching access token", { status: 500 });
    }

    if (!tokenResponse.ok) {
        console.error("Error response from token endpoint:", await tokenResponse.text());
        return new Response("Error fetching access token", { status: 500 });
    }

    const tokens = await tokenResponse.json();

    const accessTokenMaxAge = typeof tokens.expires_in === "number"
        ? tokens.expires_in
        : 60 * 60 * 24 * 365 * 16;

    cookies.set("hackatime_access_token", tokens.access_token, {
        path: "/",
        httpOnly: true,
        secure: !dev,
        sameSite: "lax",
        maxAge: accessTokenMaxAge
    });

    throw redirect(302, "/home");
};
