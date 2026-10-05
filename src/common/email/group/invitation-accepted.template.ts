import type { Locale } from '../../i18n';
import {
  baseLayout,
  divider,
  eyebrow,
  heading,
  paragraph,
  plainTextLayout,
  secondaryButton,
  subheading,
} from '../_layouts/base-layout';
import { emailCopy } from '../_layouts/copy';

/**
 * Sent to the inviter when a recipient accepts a group invitation.
 * `frontendUrl`, when provided, renders an "Open MotionHive" secondary
 * CTA so the inviter can jump straight to the app; pass `undefined` to
 * send the email without a button.
 *
 * Any of the three names may be `null` when the caller could not
 * resolve it; the copy words that case itself.
 */
export function invitationAcceptedTemplate(
  inviterName: string | null,
  accepterName: string | null,
  groupName: string | null,
  frontendUrl: string | undefined,
  locale: Locale,
): string {
  const c = emailCopy(locale, 'email.group.invitationAccepted');
  const names = {
    firstName: inviterName || null,
    name: accepterName || null,
    group: groupName || null,
  };
  const cta = frontendUrl ? secondaryButton(c.html('cta'), frontendUrl) : '';
  const content = `
    ${eyebrow(c.html('eyebrow'), 'confirmation', locale)}
    ${heading(c.html('heading'))}
    ${subheading(c.html('subheading'))}
    ${paragraph(c.html('body', names))}
    ${cta}
    ${divider()}
    ${paragraph(c.html('detail'))}
  `;

  return baseLayout(content, {
    preheader: c.html('preheader', { name: names.name, group: names.group }),
    category: 'confirmation',
    locale,
  });
}

export function invitationAcceptedTemplateText(
  inviterName: string | null,
  accepterName: string | null,
  groupName: string | null,
  frontendUrl: string | undefined,
  locale: Locale,
): string {
  const c = emailCopy(locale, 'email.group.invitationAccepted');
  const names = {
    firstName: inviterName || null,
    name: accepterName || null,
    group: groupName || null,
  };
  return plainTextLayout({
    preheader: c.text('preheader', { name: names.name, group: names.group }),
    locale,
    sections: [
      {
        heading: c.text('heading'),
        body: [c.text('body', names)],
        ...(frontendUrl
          ? { ctas: [{ label: c.text('cta'), url: frontendUrl }] }
          : {}),
      },
      { body: [c.text('detail')] },
    ],
  });
}
