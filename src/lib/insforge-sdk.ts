import { createClient } from '@insforge/sdk';

/**
 * InsForge SDK Client Initialization
 */

const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL;
const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY;

if (!baseUrl || !anonKey) {
    console.warn('[InsForge] SDK initialized without baseUrl or anonKey.');
}

// Client for browser-side usage
export const insforge = createClient({
    baseUrl: baseUrl || '',
    anonKey: anonKey || ''
});

// Factory for server-side usage (Server Actions, API Routes, Middleware)
export const createInsForgeServerClient = (accessToken?: string) => {
    return createClient({
        baseUrl: baseUrl || '',
        anonKey: anonKey || '',
        isServerMode: true,
        edgeFunctionToken: accessToken
    });
};
