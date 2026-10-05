import MessageFormat from '@messageformat/core';
import { CATALOG, MessageKey } from './catalog';
import { DEFAULT_LOCALE, Locale, SUPPORTED_LOCALES } from './locale';
import { MessageParams, resolveParams } from './params';

type CompiledMessage = (params: Record<string, unknown>) => string;

/**
 * One compiler per language (it carries that language's plural rules),
 * and each message is compiled once, on first use.
 */
const compilers = Object.fromEntries(
  SUPPORTED_LOCALES.map((locale) => [locale, new MessageFormat(locale)]),
) as Record<Locale, MessageFormat>;
const compiled = new Map<string, CompiledMessage>();

/**
 * Render a catalog message in one language.
 *
 *   translate('ro', 'email.layout.openApp')
 *   translate(locale, 'notifications.client.requestReceived.body', { name })
 *
 * Keys are checked at compile time, and every language is forced to have
 * every key, so there is no "missing translation" path to handle here.
 * The output is plain text: HTML callers escape it like any other string.
 */
export function translate(
  locale: Locale,
  key: MessageKey,
  params?: MessageParams,
): string {
  return compile(locale, key)(resolveParams(params, locale));
}

/**
 * Whether a string read back from storage (a notification row written by
 * an older deploy, say) still names a message. Keys get renamed; rows do
 * not.
 */
export function isMessageKey(key: string): key is MessageKey {
  return lookup(DEFAULT_LOCALE, key) !== undefined;
}

function compile(locale: Locale, key: MessageKey): CompiledMessage {
  const cacheKey = `${locale}:${key}`;
  let fn = compiled.get(cacheKey);
  if (!fn) {
    fn = compilers[locale].compile(lookup(locale, key) as string);
    compiled.set(cacheKey, fn);
  }
  return fn;
}

function lookup(locale: Locale, key: string): string | undefined {
  let node: unknown = CATALOG[locale];
  for (const part of key.split('.')) {
    if (node === null || typeof node !== 'object') return undefined;
    node = (node as Record<string, unknown>)[part];
  }
  return typeof node === 'string' ? node : undefined;
}
