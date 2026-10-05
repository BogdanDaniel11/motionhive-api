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

/**
 * Friend-invite email. Sent when a MotionHive user shares the app
 * with someone they know via the home-page "Invite a friend" dialog.
 *
 * The recipient is NOT being invited to be the inviter's client —
 * just to join the platform. Sign-up link carries `?ref=<userId>`
 * so the future attribution flow can credit the inviter once the
 * BE picks up the field.
 */
export interface FriendInviteParams {
  /** `null` when the inviter has no name on file; the copy words that case. */
  inviterName: string | null;
  signUpLink: string;
  personalMessage?: string;
  /** The recipient's language. */
  locale: Locale;
}

export function friendInviteTemplate(params: FriendInviteParams): string {
  const { inviterName, signUpLink, personalMessage, locale } = params;
  const c = emailCopy(locale, 'email.social.friendInvite');
  const inviter = inviterName || null;

  const content = `
    ${eyebrow(c.html('eyebrow'), 'action', locale)}
    ${heading(c.html('heading'))}
    ${subheading(c.html('subheading', { inviter }))}
    ${personCard({
      name: inviter ? escapeHtml(inviter) : c.html('anonymous'),
      role: c.html('cardRole'),
    })}
    ${paragraph(c.html('body', { inviter }))}
    ${personalMessage ? calloutBox('info', `<em>${c.html('message', { message: personalMessage })}</em>`) : ''}
    ${primaryButton(c.html('cta'), signUpLink)}
    ${securityNote(c.html('security'))}
  `;

  return baseLayout(content, {
    preheader: c.html('preheader', { inviter }),
    category: 'action',
    locale,
  });
}

export function friendInviteTemplateText(params: FriendInviteParams): string {
  const { inviterName, signUpLink, personalMessage, locale } = params;
  const c = emailCopy(locale, 'email.social.friendInvite');
  const inviter = inviterName || null;

  return plainTextLayout({
    preheader: c.text('preheader', { inviter }),
    locale,
    sections: [
      {
        heading: c.text('heading'),
        body: [
          c.text('body', { inviter }),
          ...(personalMessage
            ? [c.text('messageText', { message: personalMessage })]
            : []),
        ],
        ctas: [{ label: c.text('cta'), url: signUpLink }],
      },
      { body: [c.text('security')] },
    ],
  });
}
