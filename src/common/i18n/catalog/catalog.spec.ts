import MessageFormat from '@messageformat/core';
import { parse, Token } from '@messageformat/parser';
import { CATALOG } from '.';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '../locale';

/**
 * The compiler already forces every language to have every key (the
 * `Catalog` type). These cover what types cannot: that each string is
 * valid ICU, and that a translation interpolates the same params as the
 * English it translates.
 */

function flatten(node: unknown, prefix = ''): Array<[string, string]> {
  if (typeof node === 'string') return [[prefix, node]];
  return Object.entries(node as Record<string, unknown>).flatMap(
    ([key, value]) => flatten(value, prefix ? `${prefix}.${key}` : key),
  );
}

function paramNames(tokens: Token[], into = new Set<string>()): Set<string> {
  for (const token of tokens) {
    if ('arg' in token) into.add(token.arg);
    if ('cases' in token) {
      for (const c of token.cases) paramNames(c.tokens, into);
    }
  }
  return into;
}

const source = flatten(CATALOG[DEFAULT_LOCALE]);

describe('i18n catalog', () => {
  it.each(SUPPORTED_LOCALES)('%s: every message is valid ICU', (locale) => {
    const mf = new MessageFormat(locale);
    for (const [key, message] of flatten(CATALOG[locale])) {
      expect(() => mf.compile(message)).not.toThrow();
      expect({ key, empty: message.trim() === '' }).toEqual({
        key,
        empty: false,
      });
    }
  });

  it.each(SUPPORTED_LOCALES.filter((l) => l !== DEFAULT_LOCALE))(
    '%s: every message uses the same params as English',
    (locale) => {
      const translated = new Map(flatten(CATALOG[locale]));
      for (const [key, message] of source) {
        const expected = [...paramNames(parse(message))].sort();
        const actual = [...paramNames(parse(translated.get(key) ?? ''))].sort();
        expect({ key, params: actual }).toEqual({ key, params: expected });
      }
    },
  );

  it('every notification message has a title and a body', () => {
    for (const [module, messages] of Object.entries(
      CATALOG[DEFAULT_LOCALE].notifications,
    )) {
      for (const [name, message] of Object.entries(messages)) {
        expect({ key: `${module}.${name}`, ...message }).toEqual(
          expect.objectContaining({
            title: expect.any(String) as string,
            body: expect.any(String) as string,
          }),
        );
      }
    }
  });
});
