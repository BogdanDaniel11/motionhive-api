import type { NotifyParams } from '../notification/notification.service';
import { NotificationType } from '../notification/notification.service';
import { day, money, month } from '../../common/i18n';

/**
 * Notification builders for the payment module. Co-located with the
 * producers that use them so we keep `notification` free of any
 * payment-domain imports (and therefore avoid the circular-dep trap
 * that comes with `@Global()` modules).
 *
 * Builders take primitive arguments — never Sequelize entities — so
 * they can't be silently broken by a partially-loaded model. Callers
 * are responsible for choosing `notify()` vs `outbox.add()` based on
 * whether they're inside a transaction.
 *
 * Copy lives in the catalog (`notifications.payment.*` under
 * src/common/i18n/catalog). Builders pass raw values: amounts through
 * `money()`, dates through `day()`, and `null` for anything missing.
 */

// ---------------------------------------------------------------------------
// Invoice
// ---------------------------------------------------------------------------

interface InvoiceForBuilder {
  id: string;
  number: string | null;
  amountDueCents: number;
  currency: string;
  dueDate: Date | string | null;
}

/** A due date the message can branch on: `null` when there is none. */
function dueParam(date: Date | string | null | undefined) {
  if (!date) return null;
  return Number.isNaN(new Date(date).getTime()) ? null : day(date);
}

/** Client received a freshly-finalized invoice. */
export function invoiceCreatedForClient(
  clientId: string,
  invoice: InvoiceForBuilder,
): NotifyParams {
  return {
    userId: clientId,
    type: NotificationType.INVOICE_CREATED,
    message: {
      key: 'payment.invoiceCreated',
      params: {
        amount: money(invoice.amountDueCents, invoice.currency),
        due: dueParam(invoice.dueDate),
      },
    },
    data: { screen: 'profile/invoices', entityId: invoice.id },
  };
}

/** Instructor — Stripe confirmed the client paid. */
export function invoicePaidForInstructor(
  instructorId: string,
  invoice: InvoiceForBuilder,
): NotifyParams {
  return {
    userId: instructorId,
    type: NotificationType.INVOICE_PAID,
    message: {
      key: 'payment.invoicePaidForInstructor',
      params: { ref: invoice.number ?? invoice.id },
    },
    data: { screen: 'coaching/invoices', entityId: invoice.id },
  };
}

/** Client — payment processed (matches the instructor-side receipt). */
export function invoicePaidForClient(
  clientId: string,
  invoiceId: string,
): NotifyParams {
  return {
    userId: clientId,
    type: NotificationType.INVOICE_PAID,
    message: { key: 'payment.invoicePaidForClient' },
    data: { screen: 'profile/invoices', entityId: invoiceId },
  };
}

/** Instructor — manually marked an invoice paid (out-of-band cash etc). */
export function invoiceMarkedPaidForInstructor(
  instructorId: string,
  invoice: InvoiceForBuilder,
): NotifyParams {
  return {
    userId: instructorId,
    type: NotificationType.INVOICE_PAID,
    message: {
      key: 'payment.invoiceMarkedPaid',
      params: { ref: invoice.number ?? invoice.id },
    },
    data: { screen: 'coaching/invoices', entityId: invoice.id },
  };
}

/** Client — Stripe reported invoice payment failed (card declined etc). */
export function invoicePaymentFailedForClient(
  clientId: string,
  invoiceId: string,
): NotifyParams {
  return {
    userId: clientId,
    type: NotificationType.PAYMENT_FAILED,
    message: { key: 'payment.invoicePaymentFailed' },
    data: { screen: 'profile/invoices', entityId: invoiceId },
  };
}

// ---------------------------------------------------------------------------
// Subscription
// ---------------------------------------------------------------------------

/** Client — subscribed to an instructor's product. */
export function subscriptionCreatedForClient(
  clientId: string,
  productName: string,
): NotifyParams {
  return {
    userId: clientId,
    type: NotificationType.SUBSCRIPTION_CREATED,
    message: {
      key: 'payment.subscriptionCreated',
      params: { product: productName },
    },
    // Memberships live in a tab on /profile — no detail route, so we
    // forward queryParams instead of an entityId.
    data: { screen: 'profile', queryParams: { tab: 'memberships' } },
  };
}

/**
 * Client — subscription cancelled. `immediate=true` is rare (e.g.
 * forced cancel by support); the default at-period-end variant copy
 * reassures them they keep access until the period closes.
 */
export function subscriptionCancelledForClient(
  clientId: string,
  productName: string | null,
  immediate: boolean,
): NotifyParams {
  return {
    userId: clientId,
    type: NotificationType.SUBSCRIPTION_CANCELED,
    message: {
      key: immediate
        ? 'payment.subscriptionCancelled'
        : 'payment.subscriptionWillCancel',
      params: { product: productName },
    },
    data: { screen: 'profile', queryParams: { tab: 'memberships' } },
  };
}

// ---------------------------------------------------------------------------
// Refund
// ---------------------------------------------------------------------------

/**
 * Client — a refund has been issued for one of their payments. When the
 * payment is tied to an invoice we deep-link to that invoice; otherwise
 * we land on the Invoices tab so the client can find it themselves.
 */
export function refundIssuedForClient(
  clientId: string,
  refundCents: number,
  currency: string,
  invoiceId: string | null,
): NotifyParams {
  const data = invoiceId
    ? { screen: 'profile/invoices', entityId: invoiceId }
    : { screen: 'profile', queryParams: { tab: 'invoices' } };
  return {
    userId: clientId,
    type: NotificationType.REFUND_ISSUED,
    message: {
      key: 'payment.refundIssued',
      params: { amount: money(refundCents, currency) },
    },
    data,
  };
}

// ---------------------------------------------------------------------------
// Reminders (jobs-module cron sweeps)
// ---------------------------------------------------------------------------

/** Client — an open invoice is due within a few days. */
export function invoiceDueSoonForClient(
  clientId: string,
  invoice: InvoiceForBuilder,
): NotifyParams {
  return {
    userId: clientId,
    type: NotificationType.INVOICE_DUE_SOON,
    message: {
      key: 'payment.invoiceDueSoon',
      params: {
        amount: money(invoice.amountDueCents, invoice.currency),
        due: dueParam(invoice.dueDate),
      },
    },
    data: { screen: 'profile/invoices', entityId: invoice.id },
    // Once per invoice, ever.
    fingerprint: `invoice_due_soon:${invoice.id}`,
  };
}

/** Client — an open invoice is now past its due date. `dayKey` (YYYY-MM-DD)
 *  scopes the fingerprint so the reminder repeats at most once per day. */
export function invoiceOverdueForClient(
  clientId: string,
  invoice: InvoiceForBuilder,
  dayKey: string,
): NotifyParams {
  return {
    userId: clientId,
    type: NotificationType.INVOICE_OVERDUE,
    message: {
      key: 'payment.invoiceOverdueForClient',
      params: { amount: money(invoice.amountDueCents, invoice.currency) },
    },
    data: { screen: 'profile/invoices', entityId: invoice.id },
    fingerprint: `invoice_overdue:${invoice.id}:${dayKey}`,
  };
}

/** Instructor — a client's invoice is overdue (once per day per invoice). */
export function invoiceOverdueForInstructor(
  instructorId: string,
  invoice: InvoiceForBuilder,
  dayKey: string,
): NotifyParams {
  return {
    userId: instructorId,
    type: NotificationType.INVOICE_OVERDUE,
    message: {
      key: 'payment.invoiceOverdueForInstructor',
      params: {
        ref: invoice.number ?? invoice.id,
        amount: money(invoice.amountDueCents, invoice.currency),
      },
    },
    data: { screen: 'coaching/invoices', entityId: invoice.id },
    fingerprint: `invoice_overdue_instr:${invoice.id}:${dayKey}`,
  };
}

/** Client — the card backing their subscription expires soon. */
export function cardExpiringForClient(
  clientId: string,
  card: {
    brand: string | null;
    last4: string | null;
    expMonth: number;
    expYear: number;
  },
): NotifyParams {
  const mm = String(card.expMonth).padStart(2, '0');
  return {
    userId: clientId,
    type: NotificationType.CARD_EXPIRING_SOON,
    message: {
      key: 'payment.cardExpiring',
      params: { last4: card.last4, expiry: `${mm}/${card.expYear}` },
    },
    data: { screen: 'profile', queryParams: { tab: 'memberships' } },
    fingerprint: `card_expiring:${clientId}:${card.expYear}${mm}`,
  };
}

/** Instructor — monthly earnings summary for the closed month. */
export function earningsSummaryForInstructor(
  instructorId: string,
  summary: {
    month: string; // "2026-05" — the month being summarised
    monthKey: string; // fingerprint scope, e.g. "2026-05:eur"
    grossCents: number;
    currency: string;
    paymentCount: number;
  },
): NotifyParams {
  return {
    userId: instructorId,
    type: NotificationType.EARNINGS_SUMMARY,
    message: {
      key: 'payment.earningsSummary',
      params: {
        month: month(summary.month),
        amount: money(summary.grossCents, summary.currency),
        count: summary.paymentCount,
      },
    },
    data: { screen: 'coaching/payments' },
    fingerprint: `earnings_summary:${instructorId}:${summary.monthKey}`,
  };
}

/**
 * Instructor — the 14-day refund window on a payment is about to close.
 *
 * Click target: the invoice that payment settled, which is where the refund is
 * issued from. A payment with no invoice behind it (a direct subscription
 * charge) has nothing to open, so it lands on the payments page instead —
 * `/coaching/payments/:id` is not a route, and sending the payment id there
 * was a 404.
 */
export function refundWindowClosingForInstructor(
  instructorId: string,
  payment: {
    id: string;
    invoiceId: string | null;
    amountCents: number;
    currency: string;
    daysLeft: number;
  },
): NotifyParams {
  return {
    userId: instructorId,
    type: NotificationType.REFUND_WINDOW_CLOSING,
    message: {
      key: 'payment.refundWindowClosing',
      params: {
        amount: money(payment.amountCents, payment.currency),
        // The message says "tomorrow" for one day, so anything sooner
        // rounds up to it.
        days: Math.max(1, payment.daysLeft),
      },
    },
    data: payment.invoiceId
      ? { screen: 'coaching/invoices', entityId: payment.invoiceId }
      : { screen: 'coaching/payments' },
    fingerprint: `refund_window:${payment.id}`,
  };
}

/** Client — dunning nudge: an open invoice's payment failed and it's still
 *  unpaid. Distinct from the one-shot webhook `invoicePaymentFailedForClient`
 *  — `dayKey` (YYYY-MM-DD) scopes the fingerprint so it repeats at most once
 *  per day until paid. */
export function invoiceDunningForClient(
  clientId: string,
  invoiceId: string,
  dayKey: string,
): NotifyParams {
  return {
    userId: clientId,
    type: NotificationType.PAYMENT_FAILED,
    message: { key: 'payment.invoiceDunning' },
    data: { screen: 'profile/invoices', entityId: invoiceId },
    fingerprint: `dunning:${invoiceId}:${dayKey}`,
  };
}

// ---------------------------------------------------------------------------
// Disputes
// ---------------------------------------------------------------------------

/** Instructor — a chargeback/dispute was opened against one of their charges. */
export function disputeOpenedForInstructor(
  instructorId: string,
  dispute: {
    id: string;
    amountCents: number;
    currency: string;
    reason: string | null;
    evidenceDueBy: Date | string | null;
  },
): NotifyParams {
  return {
    userId: instructorId,
    type: NotificationType.DISPUTE_OPENED,
    message: {
      key: 'payment.disputeOpened',
      params: {
        amount: money(dispute.amountCents, dispute.currency),
        reason: dispute.reason || null,
        due: dueParam(dispute.evidenceDueBy),
      },
    },
    // No entityId: disputes are handled in Stripe (the body says so) and the
    // app has no dispute page, so `/coaching/payments/:id` was a 404. The
    // payments page is the closest surface the instructor can act from.
    data: { screen: 'coaching/payments' },
    // Once per dispute on open.
    fingerprint: `dispute_opened:${dispute.id}`,
  };
}

/** Instructor — dispute evidence deadline is approaching (T-3 / T-1). */
export function disputeEvidenceDueForInstructor(
  instructorId: string,
  dispute: {
    id: string;
    evidenceDueBy: Date | string | null;
    daysLeft: number;
    bucket: 't3' | 't1';
  },
): NotifyParams {
  return {
    userId: instructorId,
    type: NotificationType.DISPUTE_EVIDENCE_DUE,
    message: {
      key: 'payment.disputeEvidenceDue',
      params: {
        due: dueParam(dispute.evidenceDueBy),
        days: Math.max(1, dispute.daysLeft),
      },
    },
    data: { screen: 'coaching/payments' },
    fingerprint: `dispute_deadline:${dispute.id}:${dispute.bucket}`,
  };
}

// ---------------------------------------------------------------------------
// Stripe Connect account
// ---------------------------------------------------------------------------

/** Instructor — Stripe finished verifying them; they can take payments. */
export function stripeAccountReadyForInstructor(
  instructorId: string,
): NotifyParams {
  return {
    userId: instructorId,
    type: NotificationType.STRIPE_ACCOUNT_READY,
    message: { key: 'payment.stripeAccountReady' },
    data: { screen: 'coaching/payments' },
  };
}

/** Instructor — Stripe needs more information to keep payouts active. */
export function stripeAccountRestrictedForInstructor(
  instructorId: string,
): NotifyParams {
  return {
    userId: instructorId,
    type: NotificationType.STRIPE_ACCOUNT_RESTRICTED,
    message: { key: 'payment.stripeAccountRestricted' },
    data: { screen: 'coaching/payments' },
  };
}

/**
 * Instructor — their Stripe account was disconnected. `cancelledCount`
 * is how many active subscriptions were set to end at period close.
 */
export function stripeAccountDisconnectedForInstructor(
  instructorId: string,
  cancelledCount: number,
): NotifyParams {
  return {
    userId: instructorId,
    type: NotificationType.STRIPE_ACCOUNT_RESTRICTED,
    message: {
      key: 'payment.stripeAccountDisconnected',
      params: { count: cancelledCount },
    },
    data: { screen: 'coaching/payments' },
  };
}

/** Instructor — a client cancelled their own membership. */
export function subscriptionCancelledByClientForInstructor(
  instructorId: string,
  subscriptionId: string,
  clientName: string | null,
  productName: string | null,
): NotifyParams {
  return {
    userId: instructorId,
    type: NotificationType.SUBSCRIPTION_CANCELED,
    message: {
      key: 'payment.subscriptionCancelledByClient',
      params: { name: clientName, product: productName },
    },
    data: { screen: 'coaching/subscriptions', entityId: subscriptionId },
  };
}
