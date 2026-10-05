import type { Locale } from '../../i18n';
import {
  baseLayout,
  divider,
  eyebrow,
  heading,
  paragraph,
  plainTextLayout,
  subheading,
} from '../_layouts/base-layout';
import { emailCopy } from '../_layouts/copy';

interface CollaborationEndedParams {
  recipientName: string | null;
  otherPartyName: string;
  endedBy: 'self' | 'other';
  recipientRole: 'instructor' | 'client';
  locale: Locale;
}

/**
 * Sent to BOTH parties when a coaching collaboration ends — either
 * the client leaves the trainer or the trainer archives the client.
 * Active subscriptions are NOT auto-cancelled by ending the
 * collaboration; we mention that to set the right expectation.
 *
 * Four variants, one catalog node each:
 * `email.client.collaborationEnded.<recipientRole>.<endedBy>` holds
 * the `subject` (also the preheader and the line under the heading)
 * and the `body`; the notes that only depend on who is reading sit one
 * level up, under `<recipientRole>`.
 */
export function collaborationEndedTemplate(
  params: CollaborationEndedParams,
): string {
  const { recipientName, otherPartyName, endedBy, recipientRole, locale } =
    params;
  const c = emailCopy(locale, 'email.client.collaborationEnded');
  const names = { recipient: recipientName || null, name: otherPartyName };
  const headline = c.html(`${recipientRole}.${endedBy}.subject`, {
    name: otherPartyName,
  });

  const content = `
    ${eyebrow('', 'update', locale)}
    ${heading(c.html('heading'))}
    ${subheading(headline)}
    ${paragraph(c.html(`${recipientRole}.${endedBy}.body`, names))}
    ${paragraph(c.html(`${recipientRole}.membershipNote`))}
    ${divider()}
    ${paragraph(c.html(`${recipientRole}.reconnect`))}
  `;

  return baseLayout(content, {
    preheader: headline,
    footerNote: c.html(`${recipientRole}.footerNote`),
    category: 'update',
    locale,
  });
}

export function collaborationEndedTemplateText(
  params: CollaborationEndedParams,
): string {
  const { recipientName, otherPartyName, endedBy, recipientRole, locale } =
    params;
  const c = emailCopy(locale, 'email.client.collaborationEnded');
  const names = { recipient: recipientName || null, name: otherPartyName };
  const headline = c.text(`${recipientRole}.${endedBy}.subject`, {
    name: otherPartyName,
  });

  return plainTextLayout({
    preheader: headline,
    footerNote: c.text(`${recipientRole}.footerNote`),
    locale,
    sections: [
      {
        heading: c.text('heading'),
        body: [
          headline,
          c.text(`${recipientRole}.${endedBy}.body`, names),
          c.text(`${recipientRole}.membershipNote`),
        ],
      },
      { body: [c.text(`${recipientRole}.reconnect`)] },
    ],
  });
}
