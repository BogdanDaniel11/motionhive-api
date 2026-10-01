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
 * the coach when a user accepted their invitation. The template is not
 * told which, so its copy never calls the responder a coach or a
 * client.
 */
export function clientRequestAcceptedTemplate(
  params: ClientRequestAcceptedParams,
): string {
  const { recipientFirstName, responderName, appLink, locale } = params;
  const c = emailCopy(locale, 'email.client.requestAccepted');
  const name = { name: responderName };

  const content = `
    ${eyebrow(c.html('eyebrow'), 'confirmation')}
    ${paragraph(c.html('greeting', { recipient: recipientFirstName || null }))}
    ${heading(c.html('heading'))}
    ${personCard({ name: escapeHtml(responderName), role: c.html('personRole') })}
    ${paragraph(c.html('body', name))}
    ${secondaryButton(c.html('cta'), appLink)}
  `;

  return baseLayout(content, {
    preheader: c.html('preheader', name),
    category: 'confirmation',
    locale,
  });
}

export function clientRequestAcceptedTemplateText(
  params: ClientRequestAcceptedParams,
): string {
  const { recipientFirstName, responderName, appLink, locale } = params;
  const c = emailCopy(locale, 'email.client.requestAccepted');
  const name = { name: responderName };

  return plainTextLayout({
    preheader: c.text('preheader', name),
    locale,
    sections: [
      {
        heading: c.text('heading'),
        body: [
          c.text('greeting', { recipient: recipientFirstName || null }),
          c.text('body', name),
        ],
        ctas: [{ label: c.text('cta'), url: appLink }],
      },
    ],
  });
}
