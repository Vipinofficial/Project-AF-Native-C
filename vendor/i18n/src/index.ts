import { en } from './en.ts';
import { hi } from './hi.ts';
import type { Dictionary, Lang } from './types.ts';

export const dictionaries: Record<Lang, Dictionary> = { en, hi };

/**
 * Resolve a dictionary for a language. Apps wrap this in their own provider
 * (`I18nProvider`) rather than importing dictionaries into components directly.
 *
 *   const t = getDictionary(lang).customer;
 *   t.addToCart  // typed; a typo is a compile error
 */
export function getDictionary(lang: Lang): Dictionary {
  return dictionaries[lang];
}

/**
 * A flattened `common + customer` (or `common + merchant`) dictionary.
 *
 * The namespaces exist so genuinely per-app strings — `tagline`, `loginTitle` —
 * can differ. But an app only ever needs its own two, and flattening them keeps
 * every existing `t.addToCart` call site working while staying fully typed.
 */
export type CustomerDictionary = Dictionary['common'] & Dictionary['customer'];
export type MerchantDictionary = Dictionary['common'] & Dictionary['merchant'];

export function getCustomerDictionary(lang: Lang): CustomerDictionary {
  const d = dictionaries[lang];
  return { ...d.common, ...d.customer };
}

export function getMerchantDictionary(lang: Lang): MerchantDictionary {
  const d = dictionaries[lang];
  return { ...d.common, ...d.merchant };
}

/** Toggle between the two supported languages. */
export function toggleLang(lang: Lang): Lang {
  return lang === 'en' ? 'hi' : 'en';
}

/** Short label for the *other* language, for the toggle button. */
export function otherLangLabel(lang: Lang): string {
  return lang === 'en' ? 'हिं' : 'EN';
}

export { en, hi };
export { LANGS } from './types.ts';
export type {
  Dictionary,
  Lang,
  Namespace,
  CommonKey,
  CustomerKey,
  MerchantKey,
} from './types.ts';
