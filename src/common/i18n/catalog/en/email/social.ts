export const social = {
  friendInvite: {
    subject:
      '{inviter, select, null {A friend} other {{inviter}}} invited you to MotionHive',
    preheader:
      '{inviter, select, null {A friend} other {{inviter}}} invited you to MotionHive',
    eyebrow: 'INVITATION',
    heading: 'Come train with me on MotionHive',
    subheading:
      "{inviter, select, null {A friend} other {{inviter}}} thinks you'd like it here",
    /** Name on the person card when the inviter has no name on file. */
    anonymous: 'A friend',
    cardRole: 'Sent you an invite',
    body: '**{inviter, select, null {A friend} other {{inviter}}}** uses MotionHive to find coaches, book sessions, and track workouts. They thought you might enjoy it too.',
    /** The inviter's own words, quoted. */
    message: '"{message}"',
    messageText: 'Message: "{message}"',
    cta: 'Join MotionHive',
    security: "If you didn't expect this email, you can safely ignore it.",
  },
  instructorSuggestion: {
    subject:
      '{recommender, select, null {A MotionHive user} other {{recommender}}} suggested you join MotionHive',
    preheader:
      '{recommender, select, null {A MotionHive user} other {{recommender}}} suggested you join MotionHive',
    eyebrow: 'SUGGESTION',
    heading: "Hey {coach} — someone thinks you'd be a great fit here",
    subheading:
      '{recommender, select, null {A MotionHive user} other {{recommender}}} suggested you join MotionHive',
    /** Name on the person card when the recommender has no name on file. */
    anonymous: 'A MotionHive user',
    cardRole: 'Suggested you',
    body: "**{recommender, select, null {A MotionHive user} other {{recommender}}}** uses MotionHive and recommended you as a coach worth having on the platform. We'd love to have you.",
    /** The recommender's own words, quoted. */
    note: '"{note}"',
    noteText: 'Note: "{note}"',
    cta: 'Set up your coach profile',
    security: "If this isn't for you, no worries — just ignore this email.",
  },
};
