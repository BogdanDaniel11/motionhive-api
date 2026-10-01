import { formatDay, formatMoney, Locale, money } from '../../i18n';
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
  primaryButton,
  secondaryButton,
  subheading,
} from '../_layouts/base-layout';
import { emailCopy } from '../_layouts/copy';

/**
 * Invoice send email (override-email path).
 *
 * Used when the instructor chooses to email the invoice to an address
 * that differs from the customer's on-file email. Stripe's native
 * `sendInvoice` endpoint always targets the customer's saved email,
 * so for a one-off override we take over delivery from our side and
 * link to the hosted invoice page Stripe already generated.
 *
 * The amount and due date arrive raw and are formatted here, in the
 * reader's language.
 */
export interface InvoiceSendParams {
  /** `null` when the instructor has no name on file; the copy words that case. */
  instructorName: string | null;
  /** Amount due, in minor units. */
  amountCents: number;
  currency: string;
  dueDate: Date | string | null;
  invoiceNumber: string | null;
  hostedInvoiceUrl: string;
  invoicePdfUrl: string | null;
  recipientName?: string | null;
  /** The recipient's language. */
  locale: Locale;
}

export function invoiceSendTemplate(params: InvoiceSendParams): string {
  const {
    amountCents,
    currency,
    dueDate,
    hostedInvoiceUrl,
    invoicePdfUrl,
    locale,
  } = params;
  const c = emailCopy(locale, 'email.invoice.send');
  const instructor = params.instructorName || null;
  const ref = params.invoiceNumber || null;
  const name = params.recipientName || null;

  // The row is left out when Stripe has not numbered the invoice yet.
  const rows =
    (ref ? dataRow(c.html('numberLabel'), escapeHtml(ref)) : '') +
    dataRow(
      c.html('fromLabel'),
      instructor ? escapeHtml(instructor) : c.html('fromFallback'),
    ) +
    dataRow(
      c.html('amountLabel'),
      escapeHtml(formatMoney(amountCents, currency, locale)),
    ) +
    (dueDate
      ? dataRow(c.html('dueLabel'), escapeHtml(formatDay(dueDate, locale)))
      : '');

  const content = `
    ${eyebrow(c.html('eyebrow'), 'action', locale)}
    ${paragraph(c.html('greeting', { name }))}
    ${heading(c.html('heading'))}
    ${subheading(c.html('subheading', { instructor }))}
    ${dataCard(rows)}
    ${primaryButton(c.html('cta'), hostedInvoiceUrl)}
    ${invoicePdfUrl ? secondaryButton(c.html('pdfCta'), invoicePdfUrl) : ''}
    ${divider()}
    ${paragraph(c.html('stripe'))}
  `;

  return baseLayout(content, {
    preheader: c.html('preheader', {
      instructor,
      amount: money(amountCents, currency),
    }),
    footerNote: c.html('footerNote'),
    category: 'action',
    locale,
  });
}

export function invoiceSendTemplateText(params: InvoiceSendParams): string {
  const {
    amountCents,
    currency,
    dueDate,
    hostedInvoiceUrl,
    invoicePdfUrl,
    locale,
  } = params;
  const c = emailCopy(locale, 'email.invoice.send');
  const instructor = params.instructorName || null;
  const ref = params.invoiceNumber || null;
  const name = params.recipientName || null;

  const details = [
    ...(ref ? [{ label: c.text('numberLabel'), value: ref }] : []),
    {
      label: c.text('fromLabel'),
      value: instructor ?? c.text('fromFallback'),
    },
    {
      label: c.text('amountLabel'),
      value: formatMoney(amountCents, currency, locale),
    },
    ...(dueDate
      ? [{ label: c.text('dueLabel'), value: formatDay(dueDate, locale) }]
      : []),
  ];

  const ctas = [
    { label: c.text('cta'), url: hostedInvoiceUrl },
    ...(invoicePdfUrl ? [{ label: c.text('pdfCta'), url: invoicePdfUrl }] : []),
  ];

  return plainTextLayout({
    preheader: c.text('preheader', {
      instructor,
      amount: money(amountCents, currency),
    }),
    footerNote: c.text('footerNote'),
    locale,
    sections: [
      {
        heading: c.text('heading'),
        body: [
          c.text('greeting', { name }),
          `${c.text('subheading', { instructor })}.`,
        ],
        details,
        ctas,
      },
      { body: [c.text('stripe')] },
    ],
  });
}
