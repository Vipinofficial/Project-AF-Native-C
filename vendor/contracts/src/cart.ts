import { z } from 'zod';

/**
 * Client-side only — the cart never crosses the wire today (checkout posts a
 * flattened order instead). It lives here because web and native both need the
 * exact same shape, and `packages/core` computes totals from it.
 */
export const CartItemSchema = z.object({
  id: z.string(),
  listingId: z.number().int().positive(),
  /** Resolved to the active language at add-to-cart time. */
  name: z.string(),
  shop: z.string(),
  price: z.number().nonnegative(),
  /** 'm' for fabric sold by the metre, 'pcs' otherwise. */
  unit: z.enum(['m', 'pcs']),
  qty: z.number().int().positive(),
  hasMeas: z.boolean(),
  hasDesign: z.boolean(),
  /** Swatch colour carried over from the listing, for the cart thumbnail. */
  swatch: z.string(),
});

export type CartItem = z.infer<typeof CartItemSchema>;
