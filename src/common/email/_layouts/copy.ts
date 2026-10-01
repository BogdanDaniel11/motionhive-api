import { Locale, MessageKey, MessageParams, translate } from '../../i18n';
import { escapeHtml } from '../../utils/html.utils';

/** Every catalog key that sits under `P`, relative to it. */
type KeysUnder<P extends string> = MessageKey extends infer K
  ? K extends `${P}.${infer Rest}`
    ? Rest
    : never
  : never;

/**
 * A template's copy, in one language.
 *
 *   const c = emailCopy(locale, 'email.auth.verification');
 *   heading(c.html('heading'))
 *   plainTextLayout({ preheader: c.text('preheader'), … })
 *
 * `html()` is what goes into the HTML email. It escapes the WHOLE
 * rendered sentence, the values interpolated into it included, so a
 * template passes names and messages raw and never calls `escapeHtml`
 * on copy itself. The one piece of markup the catalog may use,
 * `**bold**`, becomes `<strong>` after escaping.
 *
 * `text()` is the same sentence as plain text: subjects, and the
 * plain-text alternative of an email. It drops the `**` markers.
 */
export function emailCopy<P extends string>(locale: Locale, prefix: P) {
  const render = (key: KeysUnder<P>, params?: MessageParams) =>
    translate(locale, `${prefix}.${key}` as MessageKey, params);

  return {
    html: (key: KeysUnder<P>, params?: MessageParams): string =>
      escapeHtml(render(key, params)).replace(
        /\*\*(.+?)\*\*/g,
        '<strong>$1</strong>',
      ),
    text: (key: KeysUnder<P>, params?: MessageParams): string =>
      render(key, params).replace(/\*\*/g, ''),
  };
}
