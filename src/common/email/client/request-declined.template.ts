import type { Locale } from '../../i18n';
import {
  baseLayout,
  eyebrow,
  heading,
  paragraph,
  plainTextLayout,
  securityNote,
} from '../_layouts/base-layout';
import { emailCopy } from '../_layouts/copy';

interface ClientRequestDeclinedParams {
  recipientFirstName: string | null;
  responderName: string;
  locale: Locale;
}

/**
 * Tells the request sender their client request was declined.
 * Intentionally brief and non-punishing — soft language is a product
 * decision, not an oversight. No CTA.
 *
 * Like the accepted email, the reader is either the client or the
 * coach (whoever sent the request), so the copy names neither role.
 */
export function clientRequestDeclinedTemplate(
  params: ClientRequestDeclinedParams,
): string {
  const { recipientFirstName, responderName, locale } = params;
  const c = emailCopy(locale, 'email.client.requestDeclined');

  const content = `
    ${eyebrow('', 'update', locale)}
    ${paragraph(c.html('greeting', { recipient: recipientFirstName || null }))}
    ${heading(c.html('heading'))}
    ${paragraph(c.html('body', { name: responderName }))}
    ${securityNote(c.html('note'))}
  `;

  return baseLayout(content, {
    preheader: c.html('preheader'),
    category: 'update',
    locale,
  });
}

export function clientRequestDeclinedTemplateText(
  params: ClientRequestDeclinedParams,
): string {
  const { recipientFirstName, responderName, locale } = params;
  const c = emailCopy(locale, 'email.client.requestDeclined');

  return plainTextLayout({
    preheader: c.text('preheader'),
    locale,
    sections: [
      {
        heading: c.text('heading'),
        body: [
          c.text('greeting', { recipient: recipientFirstName || null }),
          c.text('body', { name: responderName }),
          c.text('note'),
        ],
      },
    ],
  });
}
