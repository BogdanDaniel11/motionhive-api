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
  securityNote,
} from '../_layouts/base-layout';
import { emailCopy } from '../_layouts/copy';

interface ClientInvitationExistingUserParams {
  recipientFirstName: string | null;
  instructorName: string;
  acceptLink: string;
  message?: string;
  locale: Locale;
}

/**
 * Client invitation to a recipient who already has a MotionHive
 * account. The CTA deep-links into the in-app coaches tab with the
 * specific request open, so a single click takes them to accept or
 * decline.
 *
 * TODO [product]: same `acceptLink` is used for both buttons; the FE
 * page handles either action from the highlighted request row. When
 * a dedicated decline endpoint exists, wire the second button to it.
 */
export function clientInvitationExistingUserTemplate(
  params: ClientInvitationExistingUserParams,
): string {
  const { recipientFirstName, instructorName, acceptLink, message, locale } =
    params;
  const c = emailCopy(locale, 'email.client.invitationExistingUser');
  const name = { name: instructorName };

  const content = `
    ${eyebrow(c.html('eyebrow'), 'action')}
    ${paragraph(c.html('greeting', { recipient: recipientFirstName || null }))}
    ${heading(c.html('heading', name))}
    ${personCard({ name: escapeHtml(instructorName), role: c.html('personRole') })}
    ${paragraph(c.html('body', name))}
    ${message ? calloutBox('info', `<em>${c.html('messageQuote', { message })}</em>`) : ''}
    ${buttonRow([
      primaryButton(c.html('ctaAccept'), acceptLink),
      dangerButton(c.html('ctaDecline'), acceptLink),
    ])}
    ${securityNote(c.html('security'))}
  `;

  return baseLayout(content, {
    preheader: c.html('preheader', name),
    category: 'action',
    locale,
  });
}

export function clientInvitationExistingUserTemplateText(
  params: ClientInvitationExistingUserParams,
): string {
  const { recipientFirstName, instructorName, acceptLink, message, locale } =
    params;
  const c = emailCopy(locale, 'email.client.invitationExistingUser');
  const name = { name: instructorName };

  return plainTextLayout({
    preheader: c.text('preheader', name),
    locale,
    sections: [
      {
        heading: c.text('heading', name),
        body: [
          c.text('greeting', { recipient: recipientFirstName || null }),
          c.text('body', name),
          ...(message ? [c.text('messageLine', { message })] : []),
        ],
        ctas: [
          { label: c.text('ctaAccept'), url: acceptLink },
          { label: c.text('ctaDecline'), url: acceptLink },
        ],
      },
      { body: [c.text('security')] },
    ],
  });
}
