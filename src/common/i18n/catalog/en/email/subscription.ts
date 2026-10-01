export const subscription = {
  setup: {
    subject:
      '{instructor, select, null {Your trainer} other {{instructor}}} set up a {plan} membership — confirm to start',
    preheader:
      '{instructor, select, null {Your trainer} other {{instructor}}} set up a {plan} membership — confirm to start',
    eyebrow: 'CONFIRM MEMBERSHIP',
    greeting: '{name, select, null {Hi there,} other {Hi {name},}}',
    heading: 'Confirm your membership',
    subheading:
      '{instructor, select, null {Your trainer} other {{instructor}}} set up a recurring plan for you',
    planLabel: 'Plan',
    fromLabel: 'From',
    /** Value of the "From" row when the instructor has no name on file. */
    fromFallback: 'Your trainer',
    amountLabel: 'Amount',
    billedLabel: 'Billed',
    /** `interval` is Stripe's unit (day, week, month, year); `count` is how many of them per charge. */
    billedValue:
      '{interval, select, day {{count, plural, one {daily} other {every # days}}} week {{count, plural, one {weekly} other {every # weeks}}} month {{count, plural, one {monthly} other {every # months}}} year {{count, plural, one {yearly} other {every # years}}} other {}}',
    body: "Click below to confirm and start your membership. You'll be able to use a saved card or enter a new one — and you can cancel any time from your account.",
    cta: 'Confirm and start membership',
    security:
      "If you weren't expecting this, you can ignore this email — nothing is charged until you confirm. Payment is handled securely by Stripe.",
    footerNote:
      "You're receiving this because a trainer set up a membership for this address on MotionHive. Nothing is charged until you confirm.",
  },
};
