/**
 * Copy shared by every email: the layout chrome, not any one template.
 * Template-specific copy gets its own section next to this one
 * (`email.<domain>.<template>`) as templates are localized.
 */
export const email = {
  layout: {
    eyebrow: {
      action: 'ACTION REQUIRED',
      confirmation: 'CONFIRMED',
      update: 'UPDATE',
      time: 'REMINDER',
      request: 'REQUEST',
    },
    footer: {
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
      cookies: 'Cookie Policy',
      rightsReserved: 'All rights reserved.',
    },
    openApp: 'Open MotionHive',
  },
};
