export const feedback = {
  confirmation: {
    subject: 'Thanks for your feedback!',
    preheader: 'Thanks for your feedback!',
    eyebrow: 'FEEDBACK RECEIVED',
    heading: 'Feedback received',
    subheading: 'We appreciate you taking the time to write to us',
    /** `type` is the feedback type the form sends: BUG, SUGGESTION or OTHER. */
    intro:
      '{name, select, null {Hi there,} other {Hi {name},}} thank you for your {type, select, BUG {bug report} SUGGESTION {suggestion} other {feedback}}. Every piece of feedback helps us build a better platform.',
    /** Label of the row that quotes the title the submitter typed. */
    titleLabel:
      '{type, select, BUG {Your bug report} SUGGESTION {Your suggestion} other {Your feedback}}',
    review:
      "Our team reviews every submission. While we can't respond to each one individually, your input directly shapes what we build next.",
    thanks: 'Thanks for helping us improve MotionHive!',
    footerNote:
      "You're receiving this because you submitted feedback on MotionHive.",
  },
};
