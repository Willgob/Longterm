import { redirect } from "@sveltejs/kit";
import { dev } from "$app/environment";
import { HCA_CLIENT_ID, HCA_REDIRECT_ADDRESS } from "$env/static/private";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = ({ cookies }) => {
    const state = crypto.randomUUID();

    cookies.set("hca_oauth_state", state, {
        path: "/",
        httpOnly: true,
        secure: !dev,
        sameSite: "lax",
        maxAge: 60 * 10
    });

    const authorizeUrl = new URL("https://auth.hackclub.com/oauth/authorize");
    authorizeUrl.searchParams.set("client_id", HCA_CLIENT_ID);
    authorizeUrl.searchParams.set("redirect_uri", `${HCA_REDIRECT_ADDRESS}/api/login/callback`);
    authorizeUrl.searchParams.set("response_type", "code");
    authorizeUrl.searchParams.set("scope", "openid email name profile verification_status slack_id");
    authorizeUrl.searchParams.set("state", state);

    throw redirect(302, authorizeUrl.toString());
};