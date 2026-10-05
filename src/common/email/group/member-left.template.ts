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
  subheading,
} from '../_layouts/base-layout';
import { emailCopy } from '../_layouts/copy';

export interface GroupMemberLeftParams {
  ownerFirstName: string | null;
  /** `null` when the member's name could not be resolved. */
  memberName: string | null;
  groupName: string;
  groupLink: string;
  locale: Locale;
}

/**
 * Sent to a group owner when one of their members leaves the group
 * voluntarily (`POST /groups/:id/leave`). Matter-of-fact tone — not
 * every departure is a loss, and we don't want to make the owner
 * feel bad about routine churn.
 */
export function groupMemberLeftTemplate(params: GroupMemberLeftParams): string {
  const { ownerFirstName, memberName, groupName, groupLink, locale } = params;
  const c = emailCopy(locale, 'email.group.memberLeft');
  const name = memberName || null;
  const memberCard = name
    ? personCard({
        name: escapeHtml(name),
        role: c.html('cardRole', { group: groupName }),
      })
    : '';

  const content = `
    ${eyebrow('', 'update', locale)}
    ${paragraph(c.html('greeting', { firstName: ownerFirstName || null }))}
    ${heading(c.html('heading'))}
    ${subheading(c.html('subheading', { name, group: groupName }))}
    ${memberCard}
    ${paragraph(c.html('body', { name, group: groupName }))}
    ${secondaryButton(c.html('cta'), groupLink)}
  `;

  return baseLayout(content, {
    preheader: c.html('preheader', { name, group: groupName }),
    category: 'update',
    locale,
  });
}

export function groupMemberLeftTemplateText(
  params: GroupMemberLeftParams,
): string {
  const { ownerFirstName, memberName, groupName, groupLink, locale } = params;
  const c = emailCopy(locale, 'email.group.memberLeft');
  const name = memberName || null;
  return plainTextLayout({
    preheader: c.text('preheader', { name, group: groupName }),
    locale,
    sections: [
      {
        heading: c.text('heading'),
        body: [
          c.text('greeting', { firstName: ownerFirstName || null }),
          c.text('body', { name, group: groupName }),
        ],
        ctas: [{ label: c.text('cta'), url: groupLink }],
      },
    ],
  });
}
