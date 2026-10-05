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
  subheading,
} from '../_layouts/base-layout';
import { emailCopy } from '../_layouts/copy';

export interface GroupJoinRequestReceivedParams {
  ownerFirstName: string | null;
  /** `null` when the requester's name could not be resolved. */
  requesterName: string | null;
  groupName: string;
  reviewLink: string;
  message?: string | null;
  locale: Locale;
}

/**
 * Sent to a group owner when someone requests to join their APPROVAL-
 * policy group. The CTA deep-links to the group's join-requests page
 * so the owner can approve or decline in one click.
 *
 * TODO [product]: today the FE join-requests page accept/decline UI
 * lives inline — there's no separate `declineLink`. A single
 * `reviewLink` covers both actions, same shape as
 * `client/request-to-instructor`.
 */
export function groupJoinRequestReceivedTemplate(
  params: GroupJoinRequestReceivedParams,
): string {
  const {
    ownerFirstName,
    requesterName,
    groupName,
    reviewLink,
    message,
    locale,
  } = params;
  const c = emailCopy(locale, 'email.group.joinRequestReceived');
  const name = requesterName || null;
  const requesterCard = name
    ? personCard({ name: escapeHtml(name), role: c.html('cardRole') })
    : '';
  const messageBlock = message
    ? calloutBox('info', `<em>${c.html('quote', { message })}</em>`)
    : '';

  const content = `
    ${eyebrow(c.html('eyebrow'), 'request', locale)}
    ${paragraph(c.html('greeting', { firstName: ownerFirstName || null }))}
    ${heading(c.html('heading'))}
    ${subheading(c.html('subheading', { name, group: groupName }))}
    ${requesterCard}
    ${paragraph(c.html('body', { name, group: groupName }))}
    ${messageBlock}
    ${primaryButton(c.html('cta'), reviewLink)}
  `;

  return baseLayout(content, {
    preheader: c.html('preheader', { name, group: groupName }),
    category: 'request',
    locale,
  });
}

export function groupJoinRequestReceivedTemplateText(
  params: GroupJoinRequestReceivedParams,
): string {
  const {
    ownerFirstName,
    requesterName,
    groupName,
    reviewLink,
    message,
    locale,
  } = params;
  const c = emailCopy(locale, 'email.group.joinRequestReceived');
  const name = requesterName || null;
  return plainTextLayout({
    preheader: c.text('preheader', { name, group: groupName }),
    locale,
    sections: [
      {
        heading: c.text('heading'),
        body: [
          c.text('greeting', { firstName: ownerFirstName || null }),
          c.text('body', { name, group: groupName }),
          ...(message ? [c.text('message', { message })] : []),
        ],
        ctas: [{ label: c.text('cta'), url: reviewLink }],
      },
    ],
  });
}
