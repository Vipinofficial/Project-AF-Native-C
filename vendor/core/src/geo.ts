import type { Listing } from '@arli/contracts';

export interface Coords {
  lat: number;
  lng: number;
}

/**
 * Approximate centroids for the pincodes ARLI currently serves.
 *
 * Listings carry a pincode, not coordinates, so this is what makes "shops near
 * me" work with the data that exists today. A listing that sets its own
 * lat/lng always wins over this table.
 *
 * This is a seed, not a dataset. A production build should load the full India
 * Post pincode file (~19k entries) rather than extend this by hand — the
 * lookup below is deliberately a plain map so swapping the source is a
 * one-line change.
 */
export const PINCODE_CENTROIDS: Readonly<Record<string, Coords>> = {
  '110001': { lat: 28.6304, lng: 77.2177 }, // New Delhi, Connaught Place
  '221001': { lat: 25.3176, lng: 82.9739 }, // Varanasi
  '302001': { lat: 26.9124, lng: 75.7873 }, // Jaipur
};

const EARTH_RADIUS_KM = 6371;
const toRadians = (deg: number): number => (deg * Math.PI) / 180;

/**
 * Great-circle distance in kilometres.
 *
 * Haversine rather than a flat approximation: over the distances between
 * Indian cities a flat model is off by enough to reorder results, and it is
 * degenerate near the poles.
 */
export function distanceKm(a: Coords, b: Coords): number {
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** A listing's own coordinates if it has them, otherwise its pincode centroid. */
export function listingCoords(listing: Listing): Coords | null {
  if (typeof listing.lat === 'number' && typeof listing.lng === 'number') {
    return { lat: listing.lat, lng: listing.lng };
  }
  return PINCODE_CENTROIDS[listing.pincode] ?? null;
}

export interface ListingWithDistance {
  listing: Listing;
  /** Kilometres from the reference point. */
  distanceKm: number;
}

/**
 * Listings sorted nearest first.
 *
 * Listings whose location cannot be resolved are dropped rather than sorted to
 * the end — "nearest" is a promise, and showing a shop of unknown location
 * inside that list breaks it. `maxKm` bounds the radius.
 */
export function nearestListings(
  listings: readonly Listing[],
  from: Coords,
  options: { maxKm?: number; limit?: number } = {},
): ListingWithDistance[] {
  const { maxKm = Infinity, limit = Infinity } = options;

  const measured: ListingWithDistance[] = [];
  for (const listing of listings) {
    const coords = listingCoords(listing);
    if (!coords) continue;
    const d = distanceKm(from, coords);
    if (d > maxKm) continue;
    measured.push({ listing, distanceKm: d });
  }

  return measured
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit === Infinity ? undefined : limit);
}

/** How many listings could actually be located — for an honest empty state. */
export function locatableCount(listings: readonly Listing[]): number {
  return listings.reduce((n, l) => n + (listingCoords(l) ? 1 : 0), 0);
}

/** "1.2 km" / "850 m" — metres below a kilometre, one decimal above. */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}
