export const payment = {
  invoiceCreated: {
    title: 'New invoice',
    body: '{due, select, null {{amount}. Open it to see the details.} other {{amount} due {due}.}}',
  },
  invoicePaidForInstructor: {
    title: 'Invoice paid',
    body: 'Invoice {ref} was paid by your client.',
  },
  invoicePaidForClient: {
    title: 'Payment received',
    body: 'Thanks, your payment has been processed.',
  },
  invoiceMarkedPaid: {
    title: 'Invoice marked paid',
    body: 'Invoice {ref} marked as paid out of band.',
  },
  invoicePaymentFailed: {
    title: 'Payment failed',
    body: 'Your invoice payment failed. Please update your card and retry.',
  },
  invoiceDueSoon: {
    title: 'Invoice due soon',
    body: '{due, select, null {{amount} is due soon.} other {{amount} is due {due}.}}',
  },
  invoiceOverdueForClient: {
    title: 'Invoice overdue',
    body: '{amount} is past due. Please pay to avoid interruption.',
  },
  invoiceOverdueForInstructor: {
    title: 'Client invoice overdue',
    body: 'Invoice {ref} ({amount}) is past due.',
  },
  invoiceDunning: {
    title: 'Action needed: payment failed',
    body: 'Your invoice is still unpaid after a failed charge. Update your card and retry to keep your access.',
  },
  subscriptionCreated: {
    title: 'New subscription',
    body: 'You have been subscribed to {product}.',
  },
  subscriptionCancelled: {
    title: 'Membership cancelled',
    body: '{product, select, null {Your membership has been cancelled.} other {Your "{product}" membership has been cancelled.}}',
  },
  subscriptionWillCancel: {
    title: 'Membership will cancel',
    body: '{product, select, null {Your membership will end at the close of the current period.} other {Your "{product}" membership will end at the close of the current period.}}',
  },
  subscriptionCancelledByClient: {
    title: 'Membership cancelled by client',
    body: '{name, select, null {A client} other {{name}}} cancelled their membership{product, select, null {} other { to "{product}"}}; access ends at period close.',
  },
  refundIssued: {
    title: 'Refund processed',
    body: 'A refund of {amount} has been issued.',
  },
  refundWindowClosing: {
    title: 'Refund window closing',
    body: 'The refund window for a {amount} payment closes {days, plural, one {tomorrow} other {in # days}}.',
  },
  cardExpiring: {
    title: 'Card expiring soon',
    body: 'Your card{last4, select, null {} other { ending {last4}}} expires {expiry}. Update it to avoid a failed charge.',
  },
  earningsSummary: {
    title: 'Your {month} earnings',
    body: '{amount} across {count, plural, one {# payment} other {# payments}} in {month}.',
  },
  disputeOpened: {
    title: 'Payment disputed',
    body: 'A {amount} payment was disputed{reason, select, fraudulent { (reported as fraud)} duplicate { (duplicate charge)} product_not_received { (service not received)} product_unacceptable { (service not as described)} subscription_canceled { (subscription cancelled)} credit_not_processed { (refund not received)} unrecognized { (charge not recognised)} other {}}. {due, select, null {Respond in Stripe as soon as possible.} other {Respond with evidence by {due}.}}',
  },
  stripeAccountReady: {
    title: 'Payments enabled',
    body: 'Your Stripe account is verified. You can now issue invoices and accept payments from clients.',
  },
  stripeAccountRestricted: {
    title: 'Action required on your Stripe account',
    body: 'Stripe has flagged additional information is required to keep your payouts active. Open the Express Dashboard to resolve it.',
  },
  stripeAccountDisconnected: {
    title: 'Stripe account disconnected',
    body: 'Your Stripe account was disconnected. {count, plural, =0 {} one {# active subscription will end at the current billing period, with no future charges. } other {# active subscriptions will end at the current billing period, with no future charges. }}You can reconnect from the payments page.',
  },
  disputeEvidenceDue: {
    title: 'Dispute evidence due soon',
    body: '{due, select, null {Evidence for a disputed payment is due {days, plural, one {tomorrow} other {in # days}}.} other {Evidence for a disputed payment is due {due} ({days, plural, one {tomorrow} other {in # days}}).}} Submit it in Stripe.',
  },
};
