import {json} from '@sveltejs/kit';
import type {RequestHandler} from '@sveltejs/kit';
import {env} from '$env/dynamic/private';

export const GET: RequestHandler = async ({ fetch }) => {
    const PRICES_API_KEY = env.PRICES_API_KEY;
    const item = "ASUS Zenbook DUO 14inch Touch Ultra X7 32GB RAM 1TB SSD Moher Grey Laptop"
    const country="au"

    const params = new URLSearchParams({
        q: item,
        country: country,
        limit: "3"
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => {controller.abort()}, 95_000);
    const response = await fetch(
        `https://api.pricesapi.io/api/v1/products/search?${params}`,
        { headers: { Authorization: `Bearer ${PRICES_API_KEY}` }, signal: controller.signal }
    )
    clearTimeout(timeout);

    if (!response.ok) {
        return json(
            { error: 'Failed to fetch data from Prices API' }
        )
    }

    const data = await response.json();
    return json(data);
}

// export const GET: RequestHandler = async ({ fetch }) => {
//     return json({ message: 'Hello from the Prices API route!' });
// }
