import type { Locale } from '../locale';
import { en } from './en';
import { ro } from './ro';

/** The shape every language must fill in. Derived from English. */
export type Catalog = typeof en;

type Leaves<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends string
    ? `${Prefix}${K}`
    : Leaves<T[K], `${Prefix}${K}.`>;
}[keyof T & string];

/** Every translatable string, as a dot path: `'email.layout.openApp'`. */
export type MessageKey = Leaves<Catalog>;

export const CATALOG: Record<Locale, Catalog> = { en, ro };
