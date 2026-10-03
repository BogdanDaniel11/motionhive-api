import type { Locale } from '../../i18n';
import { escapeHtml } from '../../utils/html.utils';
import {
  baseLayout,
  calloutBox,
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
 * account. One button, into the in-app coaches tab with this request
 * highlighted; accept and decline live there. Deliberately not two
 * buttons that act from the email: mail scanners open links, and an
 * answer should take a signed-in click.
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
    ${primaryButton(c.html('cta'), acceptLink)}
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
        ctas: [{ label: c.text('cta'), url: acceptLink }],
      },
      { body: [c.text('security')] },
    ],
  });
}
