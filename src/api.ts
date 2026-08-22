import { createApiClient } from '@arli/api-client';

/**
 * The one API client for this app.
 *
 * This app is one of four standalone clients (customer/merchant × web/native)
 * that all talk to the SAME hosted ARLI API — there is one backend, deployed
 * once, shared by all of them. That URL is the default below.
 *
 * EXPO_PUBLIC_API_URL is inlined by Expo at build time. Override it in `.env`
 * to point at a different backend — e.g. your machine's LAN IP for local API
 * development against a physical device (localhost on a device means the
 * device itself, not your machine).
 */
const SHARED_BACKEND_URL = 'https://project-af-backend.onrender.com';

export const api = createApiClient({
  baseUrl: process.env.EXPO_PUBLIC_API_URL || SHARED_BACKEND_URL,
});
