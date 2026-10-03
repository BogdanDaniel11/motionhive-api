import type { Locale } from '../../i18n';
import { escapeHtml } from '../../utils/html.utils';
import {
  baseLayout,
  dataCard,
  dataRow,
  divider,
  eyebrow,
  heading,
  paragraph,
  plainTextLayout,
  subheading,
} from '../_layouts/base-layout';
import { emailCopy } from '../_layouts/copy';

/**
 * Acknowledgement of a feedback submission. Sent only to the address
 * the submitter typed (NOT looked up from a `userId` — that vector
 * was removed for security; see `FeedbackService.create`).
 *
 * `type` is the feedback type the form sends (`BUG`, `SUGGESTION`,
 * `OTHER`). The copy words each one; anything else reads as plain
 * "feedback".
 */
export function feedbackConfirmationTemplate(
  type: string,
  title: string,
  name: string | null | undefined,
  locale: Locale,
): string {
  const c = emailCopy(locale, 'email.feedback.confirmation');
  const kind = type.toUpperCase();

  const content = `
    ${eyebrow(c.html('eyebrow'), 'confirmation', locale)}
    ${heading(`${c.html('heading')} &#9989;`)}
    ${subheading(c.html('subheading'))}
    ${paragraph(c.html('intro', { name: name || null, type: kind }))}
    ${dataCard(dataRow(c.html('titleLabel', { type: kind }), escapeHtml(title)))}
    ${paragraph(c.html('review'))}
    ${divider()}
    ${paragraph(c.html('thanks'))}
  `;

  return baseLayout(content, {
    preheader: c.html('preheader'),
    footerNote: c.html('footerNote'),
    category: 'confirmation',
    locale,
  });
}

export function feedbackConfirmationTemplateText(
  type: string,
  title: string,
  name: string | null | undefined,
  locale: Locale,
): string {
  const c = emailCopy(locale, 'email.feedback.confirmation');
  const kind = type.toUpperCase();

  return plainTextLayout({
    preheader: c.text('preheader'),
    footerNote: c.text('footerNote'),
    locale,
    sections: [
      {
        heading: c.text('heading'),
        body: [c.text('intro', { name: name || null, type: kind })],
        details: [
          { label: c.text('titleLabel', { type: kind }), value: title },
        ],
      },
      { body: [c.text('review'), c.text('thanks')] },
    ],
  });
}
