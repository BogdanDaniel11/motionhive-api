import type { Locale } from '../../i18n';
import { escapeHtml } from '../../utils/html.utils';
import {
  baseLayout,
  eyebrow,
  heading,
  paragraph,
  personCard,
  plainTextLayout,
  secondaryButton,
} from '../_layouts/base-layout';
import { emailCopy } from '../_layouts/copy';

interface ClientRequestAcceptedParams {
  recipientFirstName: string | null;
  /**
   * Who sent the request, and so reads this email: a client whose
   * request a coach answered, or a coach whose invitation a user
   * answered. Picks the wording ("request" vs "invitation").
   */
  recipientRole: 'client' | 'instructor';
  responderName: string;
  appLink: string;
  locale: Locale;
}

/**
 * Tells the request sender their client request was accepted.
 * Symmetrical to `clientRequestDeclinedTemplate` — the responder name
 * is the party who accepted; the recipient is the original sender.
 *
 * The sender is the client when a coach accepted their request, and
 * the coach when a user accepted their invitation; `recipientRole`
 * picks the wording and the caller picks the link.
 */
export function clientRequestAcceptedTemplate(
  params: ClientRequestAcceptedParams,
): string {
  const { recipientFirstName, responderName, appLink, locale } = params;
  const c = emailCopy(locale, 'email.client.requestAccepted');
  const role = params.recipientRole;
  const name = { name: responderName };

  const content = `
    ${eyebrow(c.html(`${role}.eyebrow`), 'confirmation')}
    ${paragraph(c.html('greeting', { recipient: recipientFirstName || null }))}
    ${heading(c.html(`${role}.heading`))}
    ${personCard({ name: escapeHtml(responderName), role: c.html(`${role}.personRole`) })}
    ${paragraph(c.html(`${role}.body`, name))}
    ${secondaryButton(c.html('cta'), appLink)}
  `;

  return baseLayout(content, {
    preheader: c.html(`${role}.preheader`, name),
    category: 'confirmation',
    locale,
  });
}

export function clientRequestAcceptedTemplateText(
  params: ClientRequestAcceptedParams,
): string {
  const { recipientFirstName, responderName, appLink, locale } = params;
  const c = emailCopy(locale, 'email.client.requestAccepted');
  const role = params.recipientRole;
  const name = { name: responderName };

  return plainTextLayout({
    preheader: c.text(`${role}.preheader`, name),
    locale,
    sections: [
      {
        heading: c.text(`${role}.heading`),
        body: [
          c.text('greeting', { recipient: recipientFirstName || null }),
          c.text(`${role}.body`, name),
        ],
        ctas: [{ label: c.text('cta'), url: appLink }],
      },
    ],
  });
}
