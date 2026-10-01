import type { Locale } from '../../i18n';
import {
  baseLayout,
  calloutBox,
  eyebrow,
  heading,
  paragraph,
  plainTextLayout,
  primaryButton,
  subheading,
} from '../_layouts/base-layout';
import { emailCopy } from '../_layouts/copy';

/**
 * Public-facing acknowledgement when someone joins the list from the
 * marketing site. The web app is live, so the email sends them to sign
 * up now; the list itself is for news of the mobile app. Keep the tone
 * light — these are cold leads, not active users.
 */
export function waitlistConfirmationTemplate(
  name: string | null | undefined,
  signUpLink: string,
  locale: Locale,
): string {
  const c = emailCopy(locale, 'email.waitlist.confirmation');

  const content = `
    ${eyebrow(c.html('eyebrow'), 'confirmation', locale)}
    ${heading(`${c.html('heading')} &#127881;`)}
    ${subheading(c.html('subheading'))}
    ${paragraph(c.html('intro', { name: name || null }))}
    ${paragraph(c.html('live'))}
    ${primaryButton(c.html('cta'), signUpLink)}
    ${calloutBox('info', c.html('next'))}
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
  signUpLink: string,
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
        body: [c.text('intro', { name: name || null }), c.text('live')],
        ctas: [{ label: c.text('cta'), url: signUpLink }],
      },
      { body: [c.text('next')] },
    ],
  });
}
