import type { Locale } from '../../i18n';
import { escapeHtml } from '../../utils/html.utils';
import {
  baseLayout,
  buttonRow,
  calloutBox,
  dangerButton,
  eyebrow,
  heading,
  paragraph,
  personCard,
  plainTextLayout,
  primaryButton,
} from '../_layouts/base-layout';
import { emailCopy } from '../_layouts/copy';

interface ClientRequestToInstructorParams {
  instructorFirstName: string | null;
  clientName: string;
  reviewLink: string;
  message?: string;
  locale: Locale;
}

/**
 * Notifies an instructor that a user has requested to become their
 * client. The deep link opens the instructor's Clients page with the
 * specific request highlighted so they can accept or decline in one
 * click.
 *
 * TODO [product]: the same `reviewLink` is used for both accept and
 * decline buttons today (the FE page handles either action from the
 * highlighted row). When product approves a separate `declineLink`
 * pre-action, swap the second button to that URL.
 */
export function clientRequestToInstructorTemplate(
  params: ClientRequestToInstructorParams,
): string {
  const { instructorFirstName, clientName, reviewLink, message, locale } =
    params;
  const c = emailCopy(locale, 'email.client.requestToInstructor');
  const name = { name: clientName };

  const content = `
    ${eyebrow(c.html('eyebrow'), 'request')}
    ${paragraph(c.html('greeting', { recipient: instructorFirstName || null }))}
    ${heading(c.html('heading'))}
    ${personCard({ name: escapeHtml(clientName), role: c.html('personRole') })}
    ${paragraph(c.html('body', name))}
    ${message ? calloutBox('info', `<em>${c.html('messageQuote', { message })}</em>`) : ''}
    ${buttonRow([
      primaryButton(c.html('ctaAccept'), reviewLink),
      dangerButton(c.html('ctaDecline'), reviewLink),
    ])}
  `;

  return baseLayout(content, {
    preheader: c.html('preheader', name),
    category: 'request',
    locale,
  });
}

export function clientRequestToInstructorTemplateText(
  params: ClientRequestToInstructorParams,
): string {
  const { instructorFirstName, clientName, reviewLink, message, locale } =
    params;
  const c = emailCopy(locale, 'email.client.requestToInstructor');
  const name = { name: clientName };

  return plainTextLayout({
    preheader: c.text('preheader', name),
    locale,
    sections: [
      {
        heading: c.text('heading'),
        body: [
          c.text('greeting', { recipient: instructorFirstName || null }),
          c.text('body', name),
          ...(message ? [c.text('messageLine', { message })] : []),
        ],
        ctas: [
          { label: c.text('ctaAccept'), url: reviewLink },
          { label: c.text('ctaDecline'), url: reviewLink },
        ],
      },
    ],
  });
}
