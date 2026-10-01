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
  /**
   * Who sent the request, and so reads this email: a client whose
   * request a coach answered, or a coach whose invitation a user
   * answered. Picks the wording ("request" vs "invitation").
   */
  recipientRole: 'client' | 'instructor';
  responderName: string;
  locale: Locale;
}

/**
 * Tells the request sender their client request was declined.
 * Intentionally brief and non-punishing — soft language is a product
 * decision, not an oversight. No CTA.
 *
 * Like the accepted email, the reader is either the client or the
 * coach (whoever sent the request); `recipientRole` picks the wording.
 */
export function clientRequestDeclinedTemplate(
  params: ClientRequestDeclinedParams,
): string {
  const { recipientFirstName, responderName, locale } = params;
  const c = emailCopy(locale, 'email.client.requestDeclined');
  const role = params.recipientRole;

  const content = `
    ${eyebrow('', 'update', locale)}
    ${paragraph(c.html('greeting', { recipient: recipientFirstName || null }))}
    ${heading(c.html(`${role}.heading`))}
    ${paragraph(c.html(`${role}.body`, { name: responderName }))}
    ${securityNote(c.html(`${role}.note`))}
  `;

  return baseLayout(content, {
    preheader: c.html(`${role}.preheader`),
    category: 'update',
    locale,
  });
}

export function clientRequestDeclinedTemplateText(
  params: ClientRequestDeclinedParams,
): string {
  const { recipientFirstName, responderName, locale } = params;
  const c = emailCopy(locale, 'email.client.requestDeclined');
  const role = params.recipientRole;

  return plainTextLayout({
    preheader: c.text(`${role}.preheader`),
    locale,
    sections: [
      {
        heading: c.text(`${role}.heading`),
        body: [
          c.text('greeting', { recipient: recipientFirstName || null }),
          c.text(`${role}.body`, { name: responderName }),
          c.text(`${role}.note`),
        ],
      },
    ],
  });
}
