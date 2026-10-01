import type { Locale } from '../../i18n';
import {
  baseLayout,
  calloutBox,
  divider,
  eyebrow,
  heading,
  paragraph,
  plainTextLayout,
  subheading,
} from '../_layouts/base-layout';
import { emailCopy } from '../_layouts/copy';

/**
 * Public-facing acknowledgement when someone joins the pre-launch
 * waitlist from the marketing site. Keep the tone light — these are
 * cold leads, not active users.
 */
export function waitlistConfirmationTemplate(
  name: string | null | undefined,
  locale: Locale,
): string {
  const c = emailCopy(locale, 'email.waitlist.confirmation');

  const content = `
    ${eyebrow(c.html('eyebrow'), 'confirmation', locale)}
    ${heading(`${c.html('heading')} &#127881;`)}
    ${subheading(c.html('subheading'))}
    ${paragraph(c.html('intro', { name: name || null }))}
    ${paragraph(c.html('building'))}
    ${calloutBox('info', c.html('next'))}
    ${divider()}
    ${paragraph(c.html('follow'))}
  `;

  return baseLayout(content, {
    preheader: c.html('preheader'),
    footerNote: c.html('footerNote'),
    category: 'confirmation',
    locale,
  });
}

export function waitlistConfirmationTemplateText(
  name: string | null | undefined,
  locale: Locale,
): string {
  const c = emailCopy(locale, 'email.waitlist.confirmation');

  return plainTextLayout({
    preheader: c.text('preheader'),
    footerNote: c.text('footerNote'),
    locale,
    sections: [
      {
        heading: c.text('heading'),
        body: [
          c.text('intro', { name: name || null }),
          c.text('building'),
          c.text('next'),
        ],
      },
      { body: [c.text('follow')] },
    ],
  });
}
