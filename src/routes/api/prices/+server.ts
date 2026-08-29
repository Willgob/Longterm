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
        system: "You are a helpful assistant that HAS TO return json ",
        prompt: "hi there"
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

    
