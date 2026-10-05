import type { Locale } from '../../i18n';
import {
  baseLayout,
  divider,
  eyebrow,
  featureItem,
  heading,
  paragraph,
  plainTextLayout,
  secondaryButton,
  subheading,
} from '../_layouts/base-layout';
import { emailCopy } from '../_layouts/copy';

/**
 * Fired after the user verifies their email — NOT on sign-up. Drops
 * them into the app with a quick orientation of what they can do.
 *
 * `featureItem` is intentionally retained here (deprecated elsewhere)
 * because the iconed list is part of this template's voice.
 */
export function welcomeTemplate(
  firstName: string,
  frontendUrl: string,
  locale: Locale,
): string {
  const c = emailCopy(locale, 'email.auth.welcome');
  const content = `
    ${eyebrow(c.html('eyebrow'), 'confirmation')}
    ${heading(`${c.html('heading', { name: firstName })} &#9889;`)}
    ${subheading(c.html('subheading'))}
    ${paragraph(c.html('intro'))}

    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
      ${featureItem('&#127947;', c.html('featureSessions'))}
      ${featureItem('&#129309;', c.html('featureCoaches'))}
      ${featureItem('&#127942;', c.html('featureOrganize'))}
    </table>

    ${secondaryButton(c.html('cta'), frontendUrl)}
    ${divider()}
    ${paragraph(c.html('help'))}
  `;

  return baseLayout(content, {
    preheader: c.html('preheader', { name: firstName }),
    category: 'confirmation',
    locale,
  });
}

export function welcomeTemplateText(
  firstName: string,
  frontendUrl: string,
  locale: Locale,
): string {
  const c = emailCopy(locale, 'email.auth.welcome');
  return plainTextLayout({
    preheader: c.text('preheader', { name: firstName }),
    locale,
    sections: [
      {
        heading: c.text('heading', { name: firstName }),
        body: [
          c.text('subheading'),
          c.text('intro'),
          `- ${c.text('featureSessions')}`,
          `- ${c.text('featureCoaches')}`,
          `- ${c.text('featureOrganize')}`,
        ],
        ctas: [{ label: c.text('cta'), url: frontendUrl }],
      },
      { body: [c.text('help')] },
    ],
  });
}
