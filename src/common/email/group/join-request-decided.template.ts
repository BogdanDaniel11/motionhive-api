import type { Locale } from '../../i18n';
import {
  baseLayout,
  divider,
  eyebrow,
  heading,
  paragraph,
  plainTextLayout,
  secondaryButton,
  securityNote,
  subheading,
} from '../_layouts/base-layout';
import { emailCopy } from '../_layouts/copy';

export interface GroupJoinRequestDecidedParams {
  decision: 'approved' | 'rejected';
  requesterFirstName: string | null;
  groupName: string;
  groupLink: string;
  groupsListLink: string;
  locale: Locale;
}

/**
 * Sent to the user who requested to join a group, once the owner
 * decides. The `decision` flag selects the right copy ("you're in"
 * vs "not this time") so one template serves both paths.
 *
 *  - APPROVED → 'confirmation' category, "Open group" CTA
 *  - REJECTED → 'update' category, "Find another group" CTA, soft language
 */
export function groupJoinRequestDecidedTemplate(
  params: GroupJoinRequestDecidedParams,
): string {
  const {
    decision,
    requesterFirstName,
    groupName,
    groupLink,
    groupsListLink,
    locale,
  } = params;
  const c = emailCopy(locale, 'email.group.joinRequestDecided');
  const greeting = c.html('greeting', {
    firstName: requesterFirstName || null,
  });
  const group = { group: groupName };

  if (decision === 'approved') {
    const content = `
      ${eyebrow(c.html('approved.eyebrow'), 'confirmation', locale)}
      ${paragraph(greeting)}
      ${heading(c.html('approved.heading'))}
      ${subheading(c.html('approved.subheading', group))}
      ${paragraph(c.html('approved.body', group))}
      ${secondaryButton(c.html('approved.cta'), groupLink)}
      ${divider()}
      ${paragraph(c.html('approved.closing'))}
    `;
    return baseLayout(content, {
      preheader: c.html('approved.preheader', group),
      category: 'confirmation',
      locale,
    });
  }

  // rejected
  const content = `
    ${eyebrow('', 'update', locale)}
    ${paragraph(greeting)}
    ${heading(c.html('rejected.heading'))}
    ${subheading(c.html('rejected.subheading', group))}
    ${paragraph(c.html('rejected.body', group))}
    ${secondaryButton(c.html('rejected.cta'), groupsListLink)}
    ${securityNote(c.html('rejected.note'))}
  `;
  return baseLayout(content, {
    preheader: c.html('rejected.preheader', group),
    category: 'update',
    locale,
  });
}

export function groupJoinRequestDecidedTemplateText(
  params: GroupJoinRequestDecidedParams,
): string {
  const {
    decision,
    requesterFirstName,
    groupName,
    groupLink,
    groupsListLink,
    locale,
  } = params;
  const c = emailCopy(locale, 'email.group.joinRequestDecided');
  const greeting = c.text('greeting', {
    firstName: requesterFirstName || null,
  });
  const group = { group: groupName };

  if (decision === 'approved') {
    return plainTextLayout({
      preheader: c.text('approved.preheader', group),
      locale,
      sections: [
        {
          heading: c.text('approved.heading'),
          body: [
            greeting,
            `${c.text('approved.subheading', group)}.`,
            c.text('approved.body', group),
          ],
          ctas: [{ label: c.text('approved.cta'), url: groupLink }],
        },
        { body: [c.text('approved.closing')] },
      ],
    });
  }

  return plainTextLayout({
    preheader: c.text('rejected.preheader', group),
    locale,
    sections: [
      {
        heading: c.text('rejected.heading'),
        body: [greeting, c.text('rejected.body', group)],
        ctas: [{ label: c.text('rejected.cta'), url: groupsListLink }],
      },
      { body: [c.text('rejected.note')] },
    ],
  });
}
