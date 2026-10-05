import { formatMoney, Locale } from '../../i18n';
import { escapeHtml } from '../../utils/html.utils';
import {
  baseLayout,
  dataCard,
  dataRow,
  eyebrow,
  heading,
  paragraph,
  plainTextLayout,
  primaryButton,
  securityNote,
  subheading,
} from '../_layouts/base-layout';
import { emailCopy } from '../_layouts/copy';

/**
 * Sent to a client when their trainer sets up a recurring membership.
 *
 * Always-confirm policy: every new subscription requires the client
 * to explicitly confirm — even if they have a card on file from a
 * prior one. The link points at the first invoice's Stripe-hosted
 * page, which shows the plan name + amount + cycle and lets them
 * confirm with a saved card or a new one. Once they pay, Stripe
 * activates the subscription. See SECURITY_NOTES.md for the
 * rationale.
 *
 * The price and the billing cycle arrive raw and are worded here, in
 * the reader's language.
 */
export interface SubscriptionSetupParams {
  /** `null` when the instructor has no name on file; the copy words that case. */
  instructorName: string | null;
  planName: string;
  /** Price per billing cycle, in minor units. */
  amountCents: number;
  currency: string;
  /**
   * Billing cycle unit as Stripe names it (`day`, `week`, `month`,
   * `year`). `null` leaves the "Billed" row out.
   */
  interval: string | null;
  /** How many `interval`s per charge (2 + `month` = every 2 months). Defaults to 1. */
  intervalCount?: number | null;
  /** Kept named `setupUrl` for back-compat — this is the confirmation URL. */
  setupUrl: string;
  recipientName?: string | null;
  /** The recipient's language. */
  locale: Locale;
}

type Copy = ReturnType<typeof subscriptionCopy>;

function subscriptionCopy(locale: Locale) {
  return emailCopy(locale, 'email.subscription.setup');
}

/** "monthly", "every 2 months"… Empty for a missing or unknown interval. */
function billedValue(
  c: Copy,
  interval: string | null,
  intervalCount: number | null | undefined,
): string {
  if (!interval) return '';
  const count = intervalCount && intervalCount > 1 ? intervalCount : 1;
  return c.text('billedValue', { interval, count });
}

export function subscriptionSetupTemplate(
  params: SubscriptionSetupParams,
): string {
  const { planName, amountCents, currency, setupUrl, locale } = params;
  const c = subscriptionCopy(locale);
  const instructor = params.instructorName || null;
  const name = params.recipientName || null;
  const billed = billedValue(c, params.interval, params.intervalCount);

  const rows =
    dataRow(c.html('planLabel'), escapeHtml(planName)) +
    dataRow(
      c.html('fromLabel'),
      instructor ? escapeHtml(instructor) : c.html('fromFallback'),
    ) +
    dataRow(
      c.html('amountLabel'),
      escapeHtml(formatMoney(amountCents, currency, locale)),
    ) +
    (billed ? dataRow(c.html('billedLabel'), escapeHtml(billed)) : '');

  const content = `
    ${eyebrow(c.html('eyebrow'), 'action', locale)}
    ${paragraph(c.html('greeting', { name }))}
    ${heading(c.html('heading'))}
    ${subheading(c.html('subheading', { instructor }))}
    ${dataCard(rows)}
    ${paragraph(c.html('body'))}
    ${primaryButton(c.html('cta'), setupUrl)}
    ${securityNote(c.html('security'))}
  `;

  return baseLayout(content, {
    preheader: c.html('preheader', { instructor, plan: planName }),
    footerNote: c.html('footerNote'),
    category: 'action',
    locale,
  });
}

export function subscriptionSetupTemplateText(
  params: SubscriptionSetupParams,
): string {
  const { planName, amountCents, currency, setupUrl, locale } = params;
  const c = subscriptionCopy(locale);
  const instructor = params.instructorName || null;
  const name = params.recipientName || null;
  const billed = billedValue(c, params.interval, params.intervalCount);

  const details = [
    { label: c.text('planLabel'), value: planName },
    {
      label: c.text('fromLabel'),
      value: instructor ?? c.text('fromFallback'),
    },
    {
      label: c.text('amountLabel'),
      value: formatMoney(amountCents, currency, locale),
    },
    ...(billed ? [{ label: c.text('billedLabel'), value: billed }] : []),
  ];

  return plainTextLayout({
    preheader: c.text('preheader', { instructor, plan: planName }),
    footerNote: c.text('footerNote'),
    locale,
    sections: [
      {
        heading: c.text('heading'),
        body: [
          c.text('greeting', { name }),
          `${c.text('subheading', { instructor })}.`,
          c.text('body'),
        ],
        details,
        ctas: [{ label: c.text('cta'), url: setupUrl }],
      },
      { body: [c.text('security')] },
    ],
  });
}
