import type { CategoryFilter, Listing } from '@arli/contracts';
import type { Lang } from '@arli/i18n';

export interface ListingFilters {
  /** Free-text search across name, shop and description in the active language. */
  query?: string;
  /** Prefix match, matching the original `startsWith` behaviour. */
  pincode?: string;
  /** Upper bound in rupees. 0 or undefined means no limit. */
  priceMax?: number;
  cat?: CategoryFilter;
}

/**
 * Lifted verbatim from `Explore.tsx`, which was the only place it existed —
 * the native Explore screen carried its own near-copy.
 */
export function filterListings(
  listings: readonly Listing[],
  filters: ListingFilters,
  lang: Lang,
): Listing[] {
  const { query = '', pincode = '', priceMax = 0, cat = 'all' } = filters;
  const q = query.trim().toLowerCase();
  const pin = pincode.trim();

  return listings.filter((item) => {
    if (cat !== 'all' && item.cat !== cat) return false;
    if (priceMax > 0 && item.price > priceMax) return false;
    if (pin && !item.pincode.startsWith(pin)) return false;
    if (q) {
      const haystack = [item.name[lang], item.shop[lang], item.desc[lang]];
      if (!haystack.some((field) => field.toLowerCase().includes(q))) return false;
    }
    return true;
  });
}

/** Sponsored listings first, preserving relative order within each group. */
export function sortSponsoredFirst(listings: readonly Listing[]): Listing[] {
  return [...listings].sort((a, b) => Number(b.sponsored) - Number(a.sponsored));
}

/** Unit label for a listing's price — fabric sells by the metre. */
export function priceUnit(listing: Listing): 'm' | 'pcs' {
  return listing.cat === 'fabric' ? 'm' : 'pcs';
}
