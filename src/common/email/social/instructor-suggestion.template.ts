import type { Locale } from '../../i18n';
import { escapeHtml } from '../../utils/html.utils';
import {
  baseLayout,
  calloutBox,
  eyebrow,
  heading,
  paragraph,
  personCard,
  plainTextLayout,
  primaryButton,
  securityNote,
  subheading,
} from '../_layouts/base-layout';
import { emailCopy } from '../_layouts/copy';

/**
 * Instructor-suggestion email. A MotionHive user thinks a particular
 * coach should be on the platform; the email goes to that coach's
 * inbox with a sign-up link for the instructor flow.
 *
 * Personalized: it names the user who recommended them so the
 * recipient sees it's not a cold pitch from MotionHive itself.
 */
export interface InstructorSuggestionParams {
  coachName: string;
  /** `null` when the recommender has no name on file; the copy words that case. */
  recommenderName: string | null;
  signUpLink: string;
  note?: string;
  /**
   * The language to write to the coach in. They have no account yet,
   * so this is the recommender's best guess (their own language).
   */
  locale: Locale;
}

export function instructorSuggestionTemplate(
  params: InstructorSuggestionParams,
): string {
  const { coachName, recommenderName, signUpLink, note, locale } = params;
  const c = emailCopy(locale, 'email.social.instructorSuggestion');
  const recommender = recommenderName || null;

  const content = `
    ${eyebrow(c.html('eyebrow'), 'action', locale)}
    ${heading(c.html('heading', { coach: coachName }))}
    ${subheading(c.html('subheading', { recommender }))}
    ${personCard({
      name: recommender ? escapeHtml(recommender) : c.html('anonymous'),
      role: c.html('cardRole'),
    })}
    ${paragraph(c.html('body', { recommender }))}
    ${note ? calloutBox('info', `<em>${c.html('note', { note })}</em>`) : ''}
    ${primaryButton(c.html('cta'), signUpLink)}
    ${securityNote(c.html('security'))}
  `;

  return baseLayout(content, {
    preheader: c.html('preheader', { recommender }),
    category: 'action',
    locale,
  });
}

export function instructorSuggestionTemplateText(
  params: InstructorSuggestionParams,
): string {
  const { coachName, recommenderName, signUpLink, note, locale } = params;
  const c = emailCopy(locale, 'email.social.instructorSuggestion');
  const recommender = recommenderName || null;

  return plainTextLayout({
    preheader: c.text('preheader', { recommender }),
    locale,
    sections: [
      {
        heading: c.text('heading', { coach: coachName }),
        body: [
          c.text('body', { recommender }),
          ...(note ? [c.text('noteText', { note })] : []),
        ],
        ctas: [{ label: c.text('cta'), url: signUpLink }],
      },
      { body: [c.text('security')] },
    ],
  });
}
