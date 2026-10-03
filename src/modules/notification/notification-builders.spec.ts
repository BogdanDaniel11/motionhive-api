import { parse, Token } from '@messageformat/parser';
import { CATALOG, DEFAULT_LOCALE, SUPPORTED_LOCALES } from '../../common/i18n';
import { NOTIFICATION_SAMPLES } from '../../../test/fixtures/notification-samples';
import { notificationText } from '../../../test/helpers/notification-text';

/**
 * Every builder, with realistic values, in every language.
 *
 * The compiler checks that a builder names a message that exists. It
 * cannot check that the builder passes the values that message uses,
 * or that the rendered sentence comes out whole. These do.
 */

function paramNames(tokens: Token[], into = new Set<string>()): Set<string> {
  for (const token of tokens) {
    if ('arg' in token) into.add(token.arg);
    if ('cases' in token) {
      for (const c of token.cases) paramNames(c.tokens, into);
    }
  }
  return into;
}

const samples = NOTIFICATION_SAMPLES.map((sample) => {
  const built = sample.build();
  if (!built.message) throw new Error('sample did not build a catalog message');
  return { label: `${built.message.key} (${sample.variant})`, built };
});

describe('notification builders', () => {
  it('cover every message in the catalog', () => {
    const catalogued = Object.entries(
      CATALOG[DEFAULT_LOCALE].notifications,
    ).flatMap(([module, messages]) =>
      Object.keys(messages).map((name) => `${module}.${name}`),
    );
    const built = new Set(samples.map((s) => s.built.message?.key));
    expect(catalogued.filter((key) => !built.has(key as never))).toEqual([]);
  });

  it.each(samples)(
    '$label passes every value its message uses',
    ({ built }) => {
      const [module, name] = built.message.key.split('.');
      const messages = CATALOG[DEFAULT_LOCALE].notifications as Record<
        string,
        Record<string, { title: string; body: string }>
      >;
      const { title, body } = messages[module][name];
      const used = [...paramNames(parse(`${title} ${body}`))];
      const passed = Object.keys(built.message.params ?? {});
      expect(used.filter((param) => !passed.includes(param))).toEqual([]);
    },
  );

  describe.each(SUPPORTED_LOCALES)('rendered in %s', (locale) => {
    it.each(samples)('$label reads as a whole sentence', ({ built }) => {
      const text = notificationText(built, locale);
      for (const line of [text.title, text.body]) {
        expect(line.trim()).not.toBe('');
        expect(line).not.toMatch(/undefined|null|NaN|Invalid Date|[{}]/);
        // No doubled or dangling spaces left behind by an empty branch.
        expect(line).not.toMatch(/ {2}| [.,]|^ | $/);
      }
    });
  });
});
