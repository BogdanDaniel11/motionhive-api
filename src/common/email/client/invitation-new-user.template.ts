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
  subheading,
} from '../_layouts/base-layout';
import { emailCopy } from '../_layouts/copy';

interface ClientInvitationNewUserParams {
  instructorName: string;
  signUpLink: string;
  message?: string;
  locale: Locale;
}

/**
 * Client invitation to a recipient who does NOT yet have a MotionHive
 * account. Sign-up link carries an opt-in token; once the recipient
 * registers, `acceptByToken` auto-accepts the invitation. Without a
 * token they can still sign up via the generic referral path.
 */
export function clientInvitationNewUserTemplate(
  params: ClientInvitationNewUserParams,
): string {
  const { instructorName, signUpLink, message, locale } = params;
  const c = emailCopy(locale, 'email.client.invitationNewUser');
  const name = { name: instructorName };

  const content = `
    ${eyebrow(c.html('eyebrow'), 'action')}
    ${heading(c.html('heading'))}
    ${subheading(c.html('subheading', name))}
    ${personCard({ name: escapeHtml(instructorName), role: c.html('personRole') })}
    ${paragraph(c.html('body', name))}
    ${message ? calloutBox('info', `<em>${c.html('messageQuote', { message })}</em>`) : ''}
    ${primaryButton(c.html('cta'), signUpLink)}
    ${securityNote(c.html('security'))}
  `;

  return baseLayout(content, {
    preheader: c.html('preheader', name),
    category: 'action',
    locale,
  });
}

export function clientInvitationNewUserTemplateText(
  params: ClientInvitationNewUserParams,
): string {
  const { instructorName, signUpLink, message, locale } = params;
  const c = emailCopy(locale, 'email.client.invitationNewUser');
  const name = { name: instructorName };

  return plainTextLayout({
    preheader: c.text('preheader', name),
    locale,
    sections: [
      {
        heading: c.text('heading'),
        body: [
          c.text('body', name),
          ...(message ? [c.text('messageLine', { message })] : []),
        ],
        ctas: [{ label: c.text('cta'), url: signUpLink }],
      },
      { body: [c.text('security')] },
    ],
  });
}
