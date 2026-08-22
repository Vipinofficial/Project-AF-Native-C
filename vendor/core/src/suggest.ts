import type { Listing } from '@arli/contracts';
import type { Lang } from '@arli/i18n';

export type SuggestionKind = 'listing' | 'shop' | 'category';

export interface Suggestion {
  kind: SuggestionKind;
  /** What the user sees, already resolved to the active language. */
  label: string;
  /** Secondary line, e.g. the shop a listing belongs to. */
  detail?: string;
  /** Set for 'listing' so the caller can jump straight to the detail page. */
  listingId?: number;
}

const CATEGORY_LABEL_KEY = {
  fabric: 'catFabric',
  garment: 'catGarment',
  service: 'catService',
} as const;

/**
 * Search suggestions built from the listings already in memory — no extra
 * request, and it works offline. Matches are prefix-first so typing "ban"
 * surfaces "Banarasi…" above a listing that merely contains the letters.
 */
export function suggestSearch(
  listings: readonly Listing[],
  rawQuery: string,
  lang: Lang,
  categoryLabels: Record<string, string>,
  limit = 8,
): Suggestion[] {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return [];

  const rank = (text: string): number => {
    const t = text.toLowerCase();
    if (t.startsWith(q)) return 0;
    if (t.includes(q)) return 1;
    return -1;
  };

  const out: Array<Suggestion & { score: number }> = [];
  const seen = new Set<string>();

  const push = (s: Suggestion, score: number) => {
    const key = `${s.kind}:${s.label}`;
    if (score < 0 || seen.has(key)) return;
    seen.add(key);
    out.push({ ...s, score });
  };

  for (const listing of listings) {
    push(
      { kind: 'listing', label: listing.name[lang], detail: listing.shop[lang], listingId: listing.id },
      rank(listing.name[lang]),
    );
    push({ kind: 'shop', label: listing.shop[lang] }, rank(listing.shop[lang]));

    const catKey = CATEGORY_LABEL_KEY[listing.cat];
    const catLabel = categoryLabels[catKey];
    if (catLabel) push({ kind: 'category', label: catLabel }, rank(catLabel));
  }

  // Prefix matches first, then listings before shops before categories.
  const kindOrder: Record<SuggestionKind, number> = { listing: 0, shop: 1, category: 2 };
  return out
    .sort((a, b) => a.score - b.score || kindOrder[a.kind] - kindOrder[b.kind] || a.label.localeCompare(b.label))
    .slice(0, limit)
    .map(({ score, ...s }) => { void score; return s; });
}
