import { json, type RequestHandler } from '@sveltejs/kit';
import {env} from '$env/dynamic/private';

import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { generateText } from 'ai';

const request = createOpenRouter({
    apiKey: env.HC_AI,
    baseUrl: "https://ai.hackclub.com/proxy/v1"
})

export const GET: RequestHandler = async () => {
    const { text } = await generateText({
        model: request("perplexity/sonar-pro-search"),
        system: "You are a helpful assistant that HAS TO return json. You are the price search of a hackclub YSWS. You will be given a prompt wiht the product and address. You will search the web for the best prices of that specific product and return the results in a json format. THe json format should be an array of objects witht he following keys: name, price in the format of a single ineger in USD, link sort from cheapest to most expensive. ensure the link is available. double check al results and also make sure that discounts are accounted for. If you cannot find any results, return an empty array. Do not return any other text or explanation.",
        prompt: "Asus Zenbook DUO 14inch Touch Ultra X7 32GB RAM 1TB SSD Moher Grey Laptop, 72 Manor road, Sydney, Australia",
    })

    const jsonText = text
        .trim()
        .replace(/^```json\s*/i, '')
        .replace(/\s*```$/, '');

    try {
        return json(JSON.parse(jsonText));
    } catch {
        return json(
            { error: 'The AI response was not valid JSON' },
            { status: 502 }
        );
    }
}

    
