import type { Locale } from '../../i18n';
import {
  baseLayout,
  eyebrow,
  heading,
  paragraph,
  plainTextLayout,
  securityNote,
  subheading,
} from '../_layouts/base-layout';
import { emailCopy } from '../_layouts/copy';

/**
 * Sent to a group inviter when the recipient declines the invitation.
 * Symmetric to `invitation-accepted` — same intent, opposite outcome.
 * Brief and non-punishing; people decline for lots of reasons.
 *
 * No CTA — there's nothing useful to do here. The inviter can still
 * invite someone else from the group page on their own time.
 *
 * `inviterName` and `declinerName` may be `null` when the caller could
 * not resolve them; the copy words that case itself.
 */
export function invitationDeclinedTemplate(
  inviterName: string | null,
  declinerName: string | null,
  groupName: string,
  locale: Locale,
): string {
  const c = emailCopy(locale, 'email.group.invitationDeclined');
  const name = declinerName || null;

  const content = `
    ${eyebrow('', 'update', locale)}
    ${heading(c.html('heading'))}
    ${subheading(c.html('subheading'))}
    ${paragraph(c.html('body', { firstName: inviterName || null, name, group: groupName }))}
    ${securityNote(c.html('note'))}
  `;

  return baseLayout(content, {
    preheader: c.html('preheader', { name, group: groupName }),
    category: 'update',
    locale,
  });
}

export function invitationDeclinedTemplateText(
  inviterName: string | null,
  declinerName: string | null,
  groupName: string,
  locale: Locale,
): string {
  const c = emailCopy(locale, 'email.group.invitationDeclined');
  const name = declinerName || null;
  return plainTextLayout({
    preheader: c.text('preheader', { name, group: groupName }),
    locale,
    sections: [
      {
        heading: c.text('heading'),
        body: [
          c.text('body', {
            firstName: inviterName || null,
            name,
            group: groupName,
          }),
          c.text('note'),
        ],
      },
    ],
  });
}
