import type { en } from './en.ts';

export type Lang = 'en' | 'hi';

export const LANGS: readonly Lang[] = ['en', 'hi'] as const;

/**
 * The English dictionary defines the key set. Every other language is typed as
 * `Dictionary`, so a missing key, a misspelled key, or a stray extra key is a
 * compile error rather than an `undefined` that silently renders as blank.
 *
 * This is the single reason this package exists — before it, the four copies of
 * the translation table had already drifted by ~20 keys with nothing to catch it.
 */
export type Dictionary = {
  [Namespace in keyof typeof en]: Record<keyof (typeof en)[Namespace], string>;
};

export type Namespace = keyof typeof en;

/** Keys available in each namespace, for components that take a key as a prop. */
export type CommonKey = keyof typeof en.common;
export type CustomerKey = keyof typeof en.customer;
export type MerchantKey = keyof typeof en.merchant;
