import type { Locale } from '../../i18n';
import { escapeHtml } from '../../utils/html.utils';
import {
  baseLayout,
  divider,
  eyebrow,
  heading,
  paragraph,
  personCard,
  plainTextLayout,
  primaryButton,
  secondaryButton,
  subheading,
} from '../_layouts/base-layout';
import { emailCopy } from '../_layouts/copy';

export interface GroupOwnershipTransferredParams {
  direction: 'received' | 'transferred';
  recipientFirstName: string | null;
  /** `null` when the other owner's name could not be resolved. */
  otherPartyName: string | null;
  groupName: string;
  groupLink: string;
  locale: Locale;
}

/**
 * Sent to both parties when group ownership is transferred. The
 * `direction` flag selects the right copy ("you handed over" vs
 * "you received") so the same template serves both recipients —
 * same pattern as `collaboration-ended.template.ts`.
 *
 * Categorised differently per direction: the new owner is a
 * 'confirmation' (something good is yours now); the old owner is
 * an 'update' (informational, neutral).
 */
export function groupOwnershipTransferredTemplate(
  params: GroupOwnershipTransferredParams,
): string {
  const {
    direction,
    recipientFirstName,
    otherPartyName,
    groupName,
    groupLink,
    locale,
  } = params;
  const c = emailCopy(locale, 'email.group.ownershipTransferred');
  const name = otherPartyName || null;
  const names = { name, group: groupName };
  const category = direction === 'received' ? 'confirmation' : 'update';

  const otherPartyCard = name
    ? personCard({
        name: escapeHtml(name),
        role: c.html(`${direction}.cardRole`),
      })
    : '';
  const cta =
    direction === 'received'
      ? primaryButton(c.html('received.cta'), groupLink)
      : secondaryButton(c.html('transferred.cta'), groupLink);

  const content = `
    ${eyebrow(c.html(`${direction}.eyebrow`), category, locale)}
    ${paragraph(c.html('greeting', { firstName: recipientFirstName || null }))}
    ${heading(c.html(`${direction}.heading`, { group: groupName }))}
    ${subheading(c.html(`${direction}.subheading`, { name }))}
    ${otherPartyCard}
    ${paragraph(c.html(`${direction}.body`, names))}
    ${cta}
    ${divider()}
    ${paragraph(c.html(`${direction}.closing`))}
  `;

  return baseLayout(content, {
    preheader: c.html(`${direction}.preheader`, names),
    category,
    locale,
  });
}

export function groupOwnershipTransferredTemplateText(
  params: GroupOwnershipTransferredParams,
): string {
  const {
    direction,
    recipientFirstName,
    otherPartyName,
    groupName,
    groupLink,
    locale,
  } = params;
  const c = emailCopy(locale, 'email.group.ownershipTransferred');
  const names = { name: otherPartyName || null, group: groupName };
  return plainTextLayout({
    preheader: c.text(`${direction}.preheader`, names),
    locale,
    sections: [
      {
        heading: c.text(`${direction}.heading`, { group: groupName }),
        body: [
          c.text('greeting', { firstName: recipientFirstName || null }),
          c.text(`${direction}.body`, names),
        ],
        ctas: [{ label: c.text(`${direction}.cta`), url: groupLink }],
      },
      { body: [c.text(`${direction}.closing`)] },
    ],
  });
}
