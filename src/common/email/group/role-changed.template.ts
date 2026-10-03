import type { Locale } from '../../i18n';
import { escapeHtml } from '../../utils/html.utils';
import {
  baseLayout,
  chip,
  type ChipTone,
  dataCard,
  dataRow,
  eyebrow,
  heading,
  paragraph,
  plainTextLayout,
  secondaryButton,
  subheading,
} from '../_layouts/base-layout';
import { emailCopy } from '../_layouts/copy';

export interface GroupRoleChangedParams {
  memberFirstName: string | null;
  groupName: string;
  /**
   * The roles as `GroupMemberRole` values (`OWNER` | `MODERATOR` |
   * `MEMBER`), not display labels: the copy names them per language.
   * An unknown value reads as a plain member.
   */
  oldRole: string;
  newRole: string;
  groupLink: string;
  locale: Locale;
}

/**
 * Sent to a member when their role in a group changes (promoted to
 * moderator or demoted back to member). Owner role isn't possible
 * via this path — that's the transfer-ownership flow.
 */
export function groupRoleChangedTemplate(
  params: GroupRoleChangedParams,
): string {
  const { memberFirstName, groupName, oldRole, newRole, groupLink, locale } =
    params;
  const c = emailCopy(locale, 'email.group.roleChanged');

  // Highlight moderator promotions with a brand-honey chip; demote
  // back to plain member is neutral.
  const newTone: ChipTone = newRole === 'MODERATOR' ? 'honey' : 'neutral';

  const content = `
    ${eyebrow(c.html('eyebrow'), 'update', locale)}
    ${paragraph(c.html('greeting', { firstName: memberFirstName || null }))}
    ${heading(c.html('heading'))}
    ${subheading(c.html('subheading', { group: groupName }))}
    ${dataCard(
      dataRow(c.html('groupLabel'), escapeHtml(groupName)) +
        dataRow(
          c.html('wasLabel'),
          chip(c.html('role', { role: oldRole }), 'neutral'),
        ) +
        dataRow(
          c.html('nowLabel'),
          chip(c.html('role', { role: newRole }), newTone),
        ),
    )}
    ${paragraph(c.html('body', { group: groupName }))}
    ${secondaryButton(c.html('cta'), groupLink)}
  `;

  return baseLayout(content, {
    preheader: c.html('preheader', { group: groupName, role: newRole }),
    category: 'update',
    locale,
  });
}

export function groupRoleChangedTemplateText(
  params: GroupRoleChangedParams,
): string {
  const { memberFirstName, groupName, oldRole, newRole, groupLink, locale } =
    params;
  const c = emailCopy(locale, 'email.group.roleChanged');
  return plainTextLayout({
    preheader: c.text('preheader', { group: groupName, role: newRole }),
    locale,
    sections: [
      {
        heading: c.text('heading'),
        body: [
          c.text('greeting', { firstName: memberFirstName || null }),
          c.text('body', { group: groupName }),
        ],
        details: [
          { label: c.text('groupLabel'), value: groupName },
          {
            label: c.text('wasLabel'),
            value: c.text('role', { role: oldRole }),
          },
          {
            label: c.text('nowLabel'),
            value: c.text('role', { role: newRole }),
          },
        ],
        ctas: [{ label: c.text('cta'), url: groupLink }],
      },
    ],
  });
}
