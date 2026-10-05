import type { Locale } from '../../i18n';
import {
  baseLayout,
  eyebrow,
  expiryNote,
  heading,
  paragraph,
  plainTextLayout,
  primaryButton,
  securityNote,
  subheading,
} from '../_layouts/base-layout';
import { emailCopy } from '../_layouts/copy';

/**
 * Fired by `POST /auth/forgot-password`. The link contains a
 * single-use token (1h TTL) generated server-side; nothing about the
 * user's password is leaked here.
 */
export function passwordResetTemplate(
  resetLink: string,
  locale: Locale,
): string {
  const c = emailCopy(locale, 'email.auth.passwordReset');
  const content = `
    ${eyebrow('', 'action', locale)}
    ${heading(c.html('heading'))}
    ${subheading(c.html('subheading'))}
    ${paragraph(c.html('body'))}
    ${primaryButton(`&#128273; ${c.html('cta')}`, resetLink)}
    ${expiryNote(c.html('expiry'), locale)}
    ${securityNote(c.html('security'))}
  `;

  return baseLayout(content, {
    preheader: c.html('preheader'),
    category: 'action',
    locale,
  });
}

export function passwordResetTemplateText(
  resetLink: string,
  locale: Locale,
): string {
  const c = emailCopy(locale, 'email.auth.passwordReset');
  return plainTextLayout({
    preheader: c.text('preheader'),
    locale,
    sections: [
      {
        heading: c.text('heading'),
        body: [`${c.text('subheading')}. ${c.text('body')}`],
        ctas: [{ label: c.text('cta'), url: resetLink }],
      },
      { body: [c.text('expiry'), c.text('security')] },
    ],
  });
}
