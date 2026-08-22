import { z } from 'zod';

/**
 * Customer reviews. Not backed by a table yet — the listing rows carry a
 * `rating` string and a `reviews` count, and the review bodies are currently
 * demo data rendered in `ListingDetail`. Defined here so the shape is agreed
 * before an endpoint exists.
 */
export const ReviewSchema = z.object({
  who: z.string(),
  /** Rendered star string, e.g. "★★★★★". Presentation-ish, kept for parity. */
  stars: z.string(),
  text: z.string(),
});

export type Review = z.infer<typeof ReviewSchema>;
