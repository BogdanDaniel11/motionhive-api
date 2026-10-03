import type { Locale } from '../../i18n';
import { escapeHtml } from '../../utils/html.utils';
import {
  baseLayout,
  calloutBox,
  divider,
  expiryNote,
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
 * Group invitation — the inviter is sending someone (registered or
 * not) a link to join their group. The accept link carries a single-
 * use token; expires in 7 days.
 *
 * `inviterName` is `null` when the inviter's account can no longer be
 * resolved; the copy words that case itself.
 */
export function invitationTemplate(
  inviterName: string | null,
  groupName: string,
  acceptLink: string,
  message: string | null | undefined,
  locale: Locale,
): string {
  const c = emailCopy(locale, 'email.group.invitation');
  const name = inviterName || null;
  const inviterCard = name
    ? personCard({ name: escapeHtml(name), role: c.html('cardRole') })
    : '';
  const messageBlock = message
    ? calloutBox('info', `<em>${c.html('quote', { message })}</em>`)
    : '';

  const content = `
    ${eyebrow(c.html('eyebrow'), 'action', locale)}
    ${heading(c.html('heading'))}
    ${subheading(c.html('subheading', { name }))}
    ${inviterCard}
    ${paragraph(c.html('body', { name, group: groupName }))}
    ${messageBlock}
    ${primaryButton(`&#129309; ${c.html('cta')}`, acceptLink)}
    ${divider()}
    ${paragraph(c.html('detail', { group: groupName }))}
    ${expiryNote(c.html('expiry'), locale)}
    ${securityNote(c.html('security'))}
  `;

  return baseLayout(content, {
    preheader: c.html('preheader', { name, group: groupName }),
    category: 'action',
    locale,
  });
}

export function invitationTemplateText(
  inviterName: string | null,
  groupName: string,
  acceptLink: string,
  message: string | null | undefined,
  locale: Locale,
): string {
  const c = emailCopy(locale, 'email.group.invitation');
  const name = inviterName || null;

  return plainTextLayout({
    preheader: c.text('preheader', { name, group: groupName }),
    locale,
    sections: [
      {
        heading: c.text('heading'),
        body: [
          c.text('body', { name, group: groupName }),
          ...(message ? [c.text('message', { message })] : []),
        ],
        ctas: [{ label: c.text('cta'), url: acceptLink }],
      },
      {
        body: [
          c.text('detail', { group: groupName }),
          c.text('expiry'),
          c.text('security'),
        ],
      },
    ],
  });
}
