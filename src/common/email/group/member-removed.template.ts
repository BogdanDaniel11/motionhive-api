import type { Locale } from '../../i18n';
import {
  baseLayout,
  eyebrow,
  heading,
  paragraph,
  plainTextLayout,
  secondaryButton,
  securityNote,
  subheading,
} from '../_layouts/base-layout';
import { emailCopy } from '../_layouts/copy';

export interface GroupMemberRemovedParams {
  memberFirstName: string | null;
  groupName: string;
  groupsListLink: string;
  locale: Locale;
}

/**
 * Sent to a member when they're removed from a group by the owner.
 * Soft, non-accusatory tone — the recipient may not have expected it.
 * No back-link to the group itself (they no longer have access);
 * point them at the groups list so they can find a new home.
 */
export function groupMemberRemovedTemplate(
  params: GroupMemberRemovedParams,
): string {
  const { memberFirstName, groupName, groupsListLink, locale } = params;
  const c = emailCopy(locale, 'email.group.memberRemoved');

  const content = `
    ${eyebrow('', 'update', locale)}
    ${paragraph(c.html('greeting', { firstName: memberFirstName || null }))}
    ${heading(c.html('heading'))}
    ${subheading(c.html('subheading', { group: groupName }))}
    ${paragraph(c.html('body', { group: groupName }))}
    ${secondaryButton(c.html('cta'), groupsListLink)}
    ${securityNote(c.html('note'))}
  `;

  return baseLayout(content, {
    preheader: c.html('preheader', { group: groupName }),
    category: 'update',
    locale,
  });
}

export function groupMemberRemovedTemplateText(
  params: GroupMemberRemovedParams,
): string {
  const { memberFirstName, groupName, groupsListLink, locale } = params;
  const c = emailCopy(locale, 'email.group.memberRemoved');
  return plainTextLayout({
    preheader: c.text('preheader', { group: groupName }),
    locale,
    sections: [
      {
        heading: c.text('heading'),
        body: [
          c.text('greeting', { firstName: memberFirstName || null }),
          c.text('body', { group: groupName }),
        ],
        ctas: [{ label: c.text('cta'), url: groupsListLink }],
      },
      { body: [c.text('note')] },
    ],
  });
}
