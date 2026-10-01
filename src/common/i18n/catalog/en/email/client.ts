/**
 * Coach ↔ client relationship emails (`src/common/email/client/`).
 *
 * `{name}` is always the OTHER person (the one the email is about),
 * `{recipient}` the reader's first name, `null` when unknown.
 * `messageQuote` / `messageLine` wrap the note the sender typed, so
 * each language uses its own quotation marks.
 */
export const client = {
  /** `sendClientInvitationEmail`: a coach invites someone with no account yet. */
  invitationNewUser: {
    subject: '{name} invited you to MotionHive',
    preheader: '{name} invited you to MotionHive',
    eyebrow: 'INVITATION',
    heading: "You've been invited!",
    subheading: '{name} wants you to join MotionHive as their client',
    personRole: 'Coach',
    body: '**{name}** would like you to join MotionHive as their client.',
    messageQuote: '"{message}"',
    messageLine: 'Message: "{message}"',
    cta: 'Join MotionHive',
    security:
      'If you already have an account, just log in and the invitation will be waiting for you.',
  },
  /** `sendExistingUserClientInvitationEmail`: a coach invites an existing user. */
  invitationExistingUser: {
    subject: '{name} wants to add you as a client on MotionHive',
    preheader: '{name} wants to add you as a client on MotionHive',
    eyebrow: 'CLIENT REQUEST',
    greeting: '{recipient, select, null {Hi,} other {Hi {recipient},}}',
    heading: '{name} sent you a client request',
    personRole: 'Coach',
    body: '**{name}** wants to add you as a client on MotionHive. Accept to start coordinating sessions, memberships and invoices together.',
    messageQuote: '"{message}"',
    messageLine: 'Message: "{message}"',
    ctaAccept: 'Accept',
    ctaDecline: 'Decline',
    security:
      "If you weren't expecting this, you can safely ignore the email or decline from your account.",
  },
  /** `sendClientRequestToInstructorEmail`: a user asks a coach to take them on. */
  requestToInstructor: {
    subject: '{name} wants to work with you on MotionHive',
    preheader: '{name} wants to work with you on MotionHive',
    eyebrow: 'NEW CLIENT REQUEST',
    greeting: '{recipient, select, null {Hi,} other {Hi {recipient},}}',
    heading: 'New client request',
    personRole: 'Prospective client',
    body: '**{name}** wants to work with you as a client.',
    messageQuote: '"{message}"',
    messageLine: 'Message: "{message}"',
    ctaAccept: 'Accept request',
    ctaDecline: 'Decline',
  },
  /**
   * `sendClientRequestAcceptedEmail`: goes to whoever SENT the request,
   * which is the client (a coach accepted them) or the coach (a user
   * accepted the invitation). The template is not told which, so the
   * copy must hold for both: never call `{name}` a coach or a client.
   */
  requestAccepted: {
    subject: '{name} accepted your request on MotionHive',
    preheader: '{name} accepted your request on MotionHive',
    eyebrow: 'REQUEST ACCEPTED',
    greeting: '{recipient, select, null {Hi,} other {Hi {recipient},}}',
    heading: 'Request accepted',
    personRole: 'Accepted your request',
    body: '**{name}** accepted your request. You can now coordinate sessions, memberships and invoices together.',
    cta: 'Open MotionHive',
  },
  /**
   * `sendClientRequestDeclinedEmail`: same two readers as
   * `requestAccepted`. Soft wording on purpose, and no call to action.
   */
  requestDeclined: {
    subject: 'Update on your request on MotionHive',
    preheader: 'Update on your request on MotionHive',
    greeting: '{recipient, select, null {Hi,} other {Hi {recipient},}}',
    heading: 'Request update',
    body: "**{name}** isn't able to take on your request at this time.",
    note: "You can explore other options on MotionHive whenever you're ready.",
  },
  /**
   * `sendCollaborationEndedEmail`: both people get one. First level is
   * who is reading (`client` / `instructor`, the `recipientRole`),
   * second is who ended it (`self` = the reader, `other` = `{name}`,
   * the `endedBy`). `subject` is also the preheader and the line under
   * the heading.
   */
  collaborationEnded: {
    heading: 'Collaboration ended',
    client: {
      self: {
        subject: 'You ended your collaboration with {name}',
        body: '{recipient, select, null {Hi there,} other {Hi {recipient},}} you ended your coaching collaboration with **{name}** on MotionHive. They no longer appear in your coaches list, and they can no longer invite you to their sessions.',
      },
      other: {
        subject: '{name} ended your collaboration',
        body: '{recipient, select, null {Hi there,} other {Hi {recipient},}} **{name}** ended your coaching collaboration on MotionHive. They no longer appear in your coaches list.',
      },
      membershipNote:
        'If you have an active membership with this trainer, it remains active until you cancel it from your billing page.',
      reconnect: 'You can always reconnect later by sending a new request.',
      footerNote:
        "You're receiving this because a coaching collaboration on your MotionHive account changed status.",
    },
    instructor: {
      self: {
        subject: 'You ended your collaboration with {name}',
        body: '{recipient, select, null {Hi there,} other {Hi {recipient},}} you ended your coaching collaboration with **{name}** on MotionHive. They no longer appear in your client list, and they can no longer see your private sessions.',
      },
      other: {
        subject: '{name} ended your collaboration',
        body: '{recipient, select, null {Hi there,} other {Hi {recipient},}} **{name}** ended your coaching collaboration on MotionHive. They no longer appear in your client list.',
      },
      membershipNote:
        "Any active memberships this client has with you remain in place until they (or you) cancel them — ending the collaboration doesn't auto-cancel subscriptions.",
      reconnect: 'You can always reconnect later by sending a new invitation.',
      footerNote:
        "You're receiving this because a coaching collaboration on your MotionHive account changed status.",
    },
  },
};
