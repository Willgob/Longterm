import { redirect } from "@sveltejs/kit";
import { dev } from "$app/environment";
import { HCA_CLIENT_ID, HCA_CLIENT_SECRET, HCA_REDIRECT_ADDRESS } from "$env/static/private";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url, cookies, fetch }) => {
    const oauthError = url.searchParams.get("error");
    if (oauthError) {
        console.error("HCA returned an error:", oauthError);
        return new Response(`Login failed: ${oauthError}`, { status: 400 });
    }

    const authCode = url.searchParams.get("code");
    if (!authCode) {
        return new Response("Missing authorization code", { status: 400 });
    }

    const expectedState = cookies.get("hca_oauth_state");
    cookies.delete("hca_oauth_state", { path: "/" });
    const state = url.searchParams.get("state");
    if (!state || !expectedState || state !== expectedState) {
        return new Response("Invalid state parameter", { status: 400 });
    }

    // Token exchange
    let tokenResponse;
    try {
        tokenResponse = await fetch("https://auth.hackclub.com/oauth/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                client_id: HCA_CLIENT_ID,
                client_secret: HCA_CLIENT_SECRET,
                code: authCode,
                redirect_uri: `${HCA_REDIRECT_ADDRESS}/api/login/callback`,
                grant_type: "authorization_code"
            })
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

    cookies.set("hca_session", tokens.access_token, {
        path: "/",
        httpOnly: true,
        secure: !dev,
        sameSite: "lax",
        maxAge: tokens.expires_in ?? 60 * 60 * 24 * 7
    });

    throw redirect(302, "/");
};