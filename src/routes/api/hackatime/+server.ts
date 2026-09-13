import { redirect } from "@sveltejs/kit";
import { dev } from "$app/environment";
import { env } from "$env/dynamic/private";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = ({ cookies }) => {
    const state = crypto.randomUUID();

    cookies.set("hackatime_oauth_state", state, {
        path: "/",
        httpOnly: true,
        secure: !dev,
        sameSite: "lax",
        maxAge: 60 * 10
    });

    const authorizeUrl = new URL("https://hackatime.hackclub.com/oauth/authorize");
    authorizeUrl.searchParams.set("client_id", env.HACKATIME_CLIENT_ID ?? "");
    authorizeUrl.searchParams.set("redirect_uri", `${env.HACKATIME_REDIRECT_ADDRESS ?? ""}/api/hackatime/callback`);
    authorizeUrl.searchParams.set("response_type", "code");
    authorizeUrl.searchParams.set("scope", "profile read");
    authorizeUrl.searchParams.set("state", state);

    throw redirect(302, authorizeUrl.toString());
};