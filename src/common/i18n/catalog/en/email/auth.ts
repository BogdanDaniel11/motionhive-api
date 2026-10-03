export const auth = {
  verification: {
    subject: 'Verify your MotionHive email',
    preheader: 'Verify your email to get started with MotionHive',
    heading: 'Verify your email',
    subheading: 'One quick step to get started',
    body: 'Thanks for signing up for MotionHive! Please verify your email address to unlock all features and start your fitness journey.',
    cta: 'Verify email address',
    expiry: 'This verification link expires in **24 hours**.',
    security:
      "If you didn't create a MotionHive account, you can safely ignore this email.",
  },
  welcome: {
    subject: 'Welcome to MotionHive!',
    preheader: 'Welcome to MotionHive, {name}!',
    eyebrow: 'WELCOME',
    heading: 'Welcome, {name}!',
    subheading:
      "You're all set to start your journey towards a healthier and more active lifestyle",
    intro: "Your MotionHive account is ready. Here's what you can do:",
    featureSessions:
      '**Join sessions.** Find and join sessions that match your goals and preferences.',
    featureCoaches: '**Work with coaches.** Get guidance made for you.',
    featureOrganize:
      '**Organize your own sessions.** Create sessions and build your community.',
    cta: 'Open MotionHive',
    help: "Need help? Just reply to this email, we're happy to assist.",
  },
  passwordReset: {
    subject: 'Reset your MotionHive password',
    preheader: 'Reset your MotionHive password',
    heading: 'Reset your password',
    subheading: 'We received a password reset request',
    body: "Click the button below to choose a new password. If you didn't make this request, you can safely ignore this email and your password won't change.",
    cta: 'Reset password',
    expiry: 'This reset link expires in **1 hour** and can only be used once.',
    security:
      "If you didn't request a password reset, someone may have entered your email by mistake. No changes have been made to your account.",
  },
  passwordChanged: {
    subject: 'Your MotionHive password was changed',
    preheader: 'Your MotionHive password was just changed',
    eyebrow: 'SECURITY',
    heading: 'Your password was changed',
    subheading: 'We noticed a password change on your account',
    body: '{name, select, null {Hi there,} other {Hi {name},}} your MotionHive password was changed on **{when}**. If this was you, no further action is needed. For safety, we also signed you out on every other device.',
    warning:
      "If you didn't make this change, your account may be compromised. Reset your password now to lock it down.",
    cta: 'Reset password',
    help: "Need help? Reply to this email, we're happy to assist.",
  },
};
