import { createApiClient } from '@arli/api-client';

/**
 * The one API client for this app.
 *
 * EXPO_PUBLIC_API_URL is inlined by Expo at build time. On a physical device
 * "localhost" is the DEVICE, not your machine — point this at your computer's
 * LAN IP (e.g. http://192.168.1.20:5000). See .env.example.
 */
export const api = createApiClient({
  baseUrl: process.env.EXPO_PUBLIC_API_URL as string,
});
