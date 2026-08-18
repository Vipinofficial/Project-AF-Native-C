/**
 * App-local UI types.
 *
 * Domain types (Listing, CartItem, Order, …) now live in `@arli/contracts`,
 * and design tokens in `@arli/tokens`. What remains here is presentation-only.
 */

/** A chat bubble. `align`/`bg`/`fg` are styling, not domain data. */
export interface Message {
  align: 'flex-start' | 'flex-end';
  bg: string;
  fg: string;
  text: string;
}
