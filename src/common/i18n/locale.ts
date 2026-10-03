/**
 * The languages MotionHive speaks. Mirrors the frontend's
 * `SUPPORTED_LANGUAGES` (beeactive-ui, core/constants/languages.const.ts):
 * adding a language means adding it in both places plus a catalog folder
 * under `./catalog/<locale>/`.
 */
export const SUPPORTED_LOCALES = ['en', 'ro'] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

/**
 * BCP 47 tags for `Intl` number/date formatting. Same mapping as the
 * frontend so a date reads identically in the app and in an email.
 */
export const INTL_LOCALE: Record<Locale, string> = {
  en: 'en-GB',
  ro: 'ro-RO',
};

export function isLocale(value: unknown): value is Locale {
  return (
    typeof value === 'string' &&
    (SUPPORTED_LOCALES as readonly string[]).includes(value)
  );
}

/**
 * Narrow anything (a `user.language` column, a job payload written by an
 * older deploy, a query param) to a supported locale. Unknown values fall
 * back to English rather than throwing: a wrong language is a nuisance, a
 * notification that fails to send is a bug.
 */
export function toLocale(value: unknown): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}
