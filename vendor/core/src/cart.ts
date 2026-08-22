import type { CartItem } from '@arli/contracts';
import { validatePromo } from './promo.ts';

/** ₹1 of loyalty value per ₹100 spent. */
export const POINTS_PER_RUPEE = 1 / 100;

/**
 * Line total. The old `CartItem` stored a `total` field alongside `price` and
 * `qty`, which could — and did — go stale. It is derived here instead.
 */
export function lineTotal(item: CartItem): number {
  return item.price * item.qty;
}

export function cartSubtotal(items: readonly CartItem[]): number {
  return items.reduce((sum, item) => sum + lineTotal(item), 0);
}

export interface CartTotals {
  subtotal: number;
  discount: number;
  total: number;
  /** Loyalty points earned, calculated on the amount actually paid. */
  points: number;
  /** The promo code that applied, if any. */
  appliedCode: string | null;
}

/**
 * The single source of truth for what a customer owes.
 *
 * Replaces two divergent implementations: `Cart.tsx` subtracted the promo
 * discount, while `Checkout.tsx` did `const total = subtotal` and posted the
 * UNDISCOUNTED amount to the API — so an applied promo was shown in the cart and
 * then silently dropped at payment.
 */
export function cartTotals(
  items: readonly CartItem[],
  promoInput = '',
): CartTotals {
  const subtotal = cartSubtotal(items);
  const { valid, promo } = validatePromo(promoInput);

  // Rounded, matching the original `Math.round(subtotal * 0.1)`.
  const discount = valid ? Math.round(subtotal * promo.rate) : 0;
  const total = subtotal - discount;

  return {
    subtotal,
    discount,
    total,
    points: loyaltyPoints(total),
    appliedCode: valid ? promo.code : null,
  };
}

/** Points are earned on what was actually paid, not the pre-discount subtotal. */
export function loyaltyPoints(amountPaid: number): number {
  return Math.round(amountPaid * POINTS_PER_RUPEE);
}

export function cartItemCount(items: readonly CartItem[]): number {
  return items.reduce((sum, item) => sum + item.qty, 0);
}

export function cartHasMeasurements(items: readonly CartItem[]): boolean {
  return items.some((item) => item.hasMeas);
}
