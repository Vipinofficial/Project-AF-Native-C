import { z } from 'zod';
import { LocalizedStringSchema } from './localized.ts';

/**
 * What a listing actually is. Note this does NOT include 'all' — that was in the
 * old `types.ts` union, but 'all' is a *filter* value, never a stored category.
 * Mixing them meant `listing.cat === 'all'` typechecked everywhere despite being
 * unreachable.
 */
export const LISTING_CATEGORIES = ['fabric', 'garment', 'service'] as const;
export const ListingCategorySchema = z.enum(LISTING_CATEGORIES);
export type ListingCategory = z.infer<typeof ListingCategorySchema>;

/** The category filter UI adds 'all' on top of the real categories. */
export const CategoryFilterSchema = z.enum([...LISTING_CATEGORIES, 'all']);
export type CategoryFilter = z.infer<typeof CategoryFilterSchema>;

export const ListingSchema = z.object({
  id: z.number().int().positive(),
  cat: ListingCategorySchema,
  price: z.number().nonnegative(),
  /** Weave swatch base colour, hex. */
  base: z.string(),
  /** Weave swatch accent colour, hex. */
  acc: z.string(),
  /**
   * Optional: the column is nullable in Postgres. The old `types.ts` had this
   * optional in WEB-C and absent in Native-C — that one-line divergence is the
   * drift this package exists to prevent. Resolved as optional.
   */
  img: z.string().optional(),
  sponsored: z.boolean(),
  /** Stored as VARCHAR(10) in Postgres, e.g. "4.9". Kept a string to match. */
  rating: z.string(),
  reviews: z.number().int().nonnegative(),
  pincode: z.string(),
  /**
   * Precise shop location, when the merchant has set one. Optional because
   * every existing listing predates it; @arli/core falls back to the pincode
   * centroid so "shops near me" still works for those.
   */
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  /** Whether the item supports bespoke fitting / attached measurements. */
  measurable: z.boolean(),
  name: LocalizedStringSchema,
  shop: LocalizedStringSchema,
  /** Maps to the `desc_text` column — `desc` is a reserved word in SQL. */
  desc: LocalizedStringSchema,
});

export type Listing = z.infer<typeof ListingSchema>;

/**
 * POST /api/listings body. The API fills defaults for everything except the
 * fields a merchant must actually supply, which is why most keys are optional.
 */
export const CreateListingSchema = ListingSchema.omit({ id: true }).partial().extend({
  cat: ListingCategorySchema.default('fabric'),
  price: z.number().nonnegative().default(0),
});

export type CreateListing = z.infer<typeof CreateListingSchema>;
