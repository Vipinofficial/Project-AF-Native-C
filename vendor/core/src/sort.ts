import type { Listing } from '@arli/contracts';

export const SORT_OPTIONS = ['relevance', 'priceAsc', 'priceDesc', 'rating', 'reviews'] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];

/** i18n keys for each option, resolved against the customer namespace. */
export const SORT_I18N_KEY = {
  relevance: 'sortRelevance',
  priceAsc: 'sortPriceAsc',
  priceDesc: 'sortPriceDesc',
  rating: 'sortRating',
  reviews: 'sortReviews',
} as const satisfies Record<SortOption, string>;

/**
 * Sorting for the catalogue (backlog #12). Pure and stable: equal keys keep
 * their incoming order, so a re-sort never shuffles the page under the user.
 *
 * 'relevance' keeps sponsored listings first, which is the existing default
 * behaviour and the one merchants pay for.
 */
export function sortListings(listings: readonly Listing[], sort: SortOption): Listing[] {
  const withIndex = listings.map((listing, index) => ({ listing, index }));

  const compare: Record<SortOption, (a: Listing, b: Listing) => number> = {
    relevance: (a, b) => Number(b.sponsored) - Number(a.sponsored),
    priceAsc: (a, b) => a.price - b.price,
    priceDesc: (a, b) => b.price - a.price,
    // rating is VARCHAR in Postgres, so compare numerically not lexically.
    rating: (a, b) => Number(b.rating) - Number(a.rating),
    reviews: (a, b) => b.reviews - a.reviews,
  };

  const cmp = compare[sort];
  return withIndex
    .sort((x, y) => cmp(x.listing, y.listing) || x.index - y.index)
    .map(({ listing }) => listing);
}
