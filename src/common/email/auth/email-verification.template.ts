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
 * Sent right after sign-up so the user can verify their email and
 * unlock the rest of the platform. The link is single-use and
 * expires in 24h — the actual TTL lives in `UserService`.
 */
export function emailVerificationTemplate(
  verifyLink: string,
  locale: Locale,
): string {
  const c = emailCopy(locale, 'email.auth.verification');
  const content = `
    ${eyebrow('', 'action', locale)}
    ${heading(c.html('heading'))}
    ${subheading(c.html('subheading'))}
    ${paragraph(c.html('body'))}
    ${primaryButton(`&#9989; ${c.html('cta')}`, verifyLink)}
    ${expiryNote(c.html('expiry'), locale)}
    ${securityNote(c.html('security'))}
  `;

  return baseLayout(content, {
    preheader: c.html('preheader'),
    category: 'action',
    locale,
  });
}

export function emailVerificationTemplateText(
  verifyLink: string,
  locale: Locale,
): string {
  const c = emailCopy(locale, 'email.auth.verification');
  return plainTextLayout({
    preheader: c.text('preheader'),
    locale,
    sections: [
      {
        heading: c.text('heading'),
        body: [c.text('body')],
        ctas: [{ label: c.text('cta'), url: verifyLink }],
      },
      { body: [c.text('expiry'), c.text('security')] },
    ],
  });
}
