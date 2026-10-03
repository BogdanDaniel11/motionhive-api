export const invoice = {
  send: {
    subject:
      '{ref, select, null {Invoice} other {Invoice {ref}}} from {instructor, select, null {your instructor} other {{instructor}}}',
    preheader:
      '{instructor, select, null {Your instructor} other {{instructor}}} sent you an invoice for {amount}',
    eyebrow: 'INVOICE',
    greeting: '{name, select, null {Hi there,} other {Hi {name},}}',
    heading: 'You have a new invoice',
    subheading:
      '{instructor, select, null {Your instructor} other {{instructor}}} sent you an invoice on MotionHive',
    numberLabel: 'Invoice #',
    fromLabel: 'From',
    /** Value of the "From" row when the instructor has no name on file. */
    fromFallback: 'Your instructor',
    amountLabel: 'Amount',
    dueLabel: 'Due',
    cta: 'View & pay invoice',
    pdfCta: 'Download PDF',
    stripe: 'Payment is handled securely by Stripe.',
    footerNote:
      "You're receiving this because an invoice was sent to this address on MotionHive.",
  },
};
