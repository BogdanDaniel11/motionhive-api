import { Locale, moment } from '../../i18n';
import {
  baseLayout,
  eyebrow,
  heading,
  paragraph,
  plainTextLayout,
  secondaryButton,
  securityNote,
  subheading,
} from '../_layouts/base-layout';
import { emailCopy } from '../_layouts/copy';

/**
 * Security notification: the user's password was just changed on a
 * logged-in session (NOT via the forgot-password flow — that path
 * already self-confirms by emailing the reset link).
 *
 * If the change was the user themselves, this is reassurance.
 * If it wasn't, this is the alert that lets them recover via the
 * "Reset password" CTA before an attacker keeps the new credential.
 */
export interface PasswordChangedParams {
  firstName: string | null;
  changedAt: Date;
  /** IANA zone to print `changedAt` in. Server zone when omitted. */
  timeZone?: string;
  resetLink: string;
  locale: Locale;
}

export function passwordChangedTemplate(params: PasswordChangedParams): string {
  const { firstName, changedAt, timeZone, resetLink, locale } = params;
  const c = emailCopy(locale, 'email.auth.passwordChanged');

  const content = `
    ${eyebrow(c.html('eyebrow'), 'update')}
    ${heading(c.html('heading'))}
    ${subheading(c.html('subheading'))}
    ${paragraph(c.html('body', { name: firstName, when: moment(changedAt, timeZone) }))}
    ${paragraph(c.html('warning'))}
    ${secondaryButton(c.html('cta'), resetLink)}
    ${securityNote(c.html('help'))}
  `;

  return baseLayout(content, {
    preheader: c.html('preheader'),
    category: 'update',
    locale,
  });
}

export function passwordChangedTemplateText(
  params: PasswordChangedParams,
): string {
  const { firstName, changedAt, timeZone, resetLink, locale } = params;
  const c = emailCopy(locale, 'email.auth.passwordChanged');
  return plainTextLayout({
    preheader: c.text('preheader'),
    locale,
    sections: [
      {
        heading: c.text('heading'),
        body: [
          c.text('body', {
            name: firstName,
            when: moment(changedAt, timeZone),
          }),
          c.text('warning'),
        ],
        ctas: [{ label: c.text('cta'), url: resetLink }],
      },
      { body: [c.text('help')] },
    ],
  });
}
