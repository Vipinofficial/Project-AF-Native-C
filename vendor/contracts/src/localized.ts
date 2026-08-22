import { z } from 'zod';

/**
 * Every user-facing string stored in the database is bilingual. In Postgres
 * these are JSONB columns; over the wire they are plain objects.
 */
export const LocalizedStringSchema = z.object({
  en: z.string(),
  hi: z.string(),
});

export type LocalizedString = z.infer<typeof LocalizedStringSchema>;
