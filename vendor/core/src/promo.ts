/**
 * Promo codes. Previously this lived as a string comparison inline in
 * `App.tsx.handleApplyPromo`, with the 10% rate hardcoded separately in
 * `Cart.tsx` — so the code that validated a promo and the code that applied it
 * had no connection to each other.
 */

export interface Promo {
  code: string;
  /** Fraction off the subtotal, 0–1. */
  rate: number;
}

export const PROMOS: readonly Promo[] = [
  { code: 'ARLI10', rate: 0.1 },
] as const;

export type PromoResult =
  | { valid: true; promo: Promo }
  | { valid: false; promo: null };

/** Case- and whitespace-insensitive, matching the old `.trim().toUpperCase()`. */
export function validatePromo(input: string): PromoResult {
  const normalised = input.trim().toUpperCase();
  const promo = PROMOS.find((p) => p.code === normalised);
  return promo ? { valid: true, promo } : { valid: false, promo: null };
}
