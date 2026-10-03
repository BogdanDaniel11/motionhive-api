import type { Locale } from './locale';

/**
 * Translations of one database row, as stored in its `translations`
 * column (migration 063):
 *
 *   { "ro": { "name": "Genuflexiuni cu haltera", "instructions": "…" } }
 *
 * Keys inside a language are the row's API field names. Only MotionHive's
 * own rows (the exercise library, muscles, equipment, starter routines)
 * carry translations; text a person wrote is shown as written.
 */
export type ContentTranslations = Partial<
  Record<Locale, Record<string, string>>
>;

/** A row that may carry translations, as Sequelize or the API sees it. */
interface Translatable {
  translations?: ContentTranslations | null;
}

/**
 * One field of a row in `locale`, falling back to the stored (English)
 * value when that language has no text for it. For the few places that
 * build a response by hand instead of returning the row; everything else
 * is localised by `localizeContent` on the way out.
 */
export function translatedText<T extends Translatable, K extends keyof T>(
  row: T,
  field: K & string,
  locale: Locale,
): T[K] {
  const translated = row.translations?.[locale]?.[field];
  return (isText(translated) ? translated : row[field]) as T[K];
}

/**
 * Put every translatable row in `data` into `locale`, in place.
 *
 * Works on plain JSON (what `CamelCaseInterceptor` produces). For each
 * object with a `translations` key: the fields that language translates
 * replace the stored ones, field by field; a replaced `name` keeps the
 * English as `originalName`, which the apps show as a second line; then
 * `translations` itself is removed, so a reader only ever receives their
 * own language.
 *
 * One rule specific to workout logs: a logged exercise keeps a snapshot
 * of the name it had when it was logged. When its live exercise is
 * translated, the snapshot follows the live name, so history reads in the
 * reader's language too. A coach's own exercise is not translated, so its
 * snapshot is left as written.
 */
export function localizeContent<T>(data: T, locale: Locale): T {
  walk(data, locale, new WeakSet());
  return data;
}

/** `bilingual` collects the rows that had translations, in any language. */
function walk(node: unknown, locale: Locale, bilingual: WeakSet<object>) {
  if (Array.isArray(node)) {
    for (const item of node) walk(item, locale, bilingual);
    return;
  }
  if (!isPlainObject(node)) return;

  for (const value of Object.values(node)) walk(value, locale, bilingual);

  if ('translations' in node) {
    const translations = node.translations;
    delete node.translations;
    if (isPlainObject(translations)) {
      overlay(node, translations, locale);
      bilingual.add(node);
    }
  }

  const exercise = node.exercise;
  if (
    typeof node.exerciseNameSnapshot === 'string' &&
    isPlainObject(exercise) &&
    bilingual.has(exercise) &&
    isText(exercise.name)
  ) {
    node.exerciseNameSnapshot = exercise.name;
  }
}

function overlay(
  node: Record<string, unknown>,
  translations: Record<string, unknown>,
  locale: Locale,
) {
  const fields = translations[locale];
  if (!isPlainObject(fields)) return;

  for (const [field, value] of Object.entries(fields)) {
    if (!(field in node) || !isText(value) || node[field] === value) continue;
    if (field === 'name' && isText(node.name)) node.originalName = node.name;
    node[field] = value;
  }
}

function isText(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== '';
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}
