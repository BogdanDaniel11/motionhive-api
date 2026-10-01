/**
 * Group emails: invitations, join requests, membership and role changes.
 *
 * Params: `firstName` is the reader, `name` the other person, `group`
 * the group's name, `role` a `GroupMemberRole` value. A name the caller
 * could not resolve is passed as `null` and worded here.
 */
export const group = {
  invitation: {
    subject: "You're invited to join {group} on MotionHive",
    preheader:
      '{name, select, null {Someone} other {{name}}} invited you to join {group}',
    eyebrow: 'INVITATION',
    heading: "You're invited!",
    subheading:
      '{name, select, null {Someone} other {{name}}} wants you to join their team',
    cardRole: 'Sent you an invitation',
    body: '{name, select, null {Someone} other {**{name}**}} has invited you to join **{group}** on MotionHive — a fitness platform for instructors and clients.',
    /** The inviter's own words, shown as a quote in the HTML email. */
    quote: '"{message}"',
    /** The same message in the plain-text email, where it needs a label. */
    message: 'Personal message: "{message}"',
    cta: 'Accept invitation',
    detail:
      "By accepting, you'll be added as a member of **{group}** and can start joining training sessions.",
    expiry: 'This invitation expires in **7 days**.',
    security:
      "If you don't know the person who sent this, you can safely ignore this email.",
  },
  invitationAccepted: {
    subject:
      '{name, select, null {Someone} other {{name}}} accepted your invitation to {group, select, null {your group} other {{group}}}',
    preheader:
      '{name, select, null {Someone} other {{name}}} accepted your invitation to {group, select, null {your group} other {{group}}}',
    eyebrow: 'INVITATION ACCEPTED',
    heading: 'Invitation accepted!',
    subheading: 'Great news — someone joined your group',
    body: '{firstName, select, null {Hi there,} other {Hi {firstName},}} {name, select, null {someone} other {**{name}**}} has accepted your invitation and joined {group, select, null {your group} other {**{group}**}}.',
    cta: 'Open MotionHive',
    detail: 'You can view your group members in the MotionHive app.',
  },
  invitationDeclined: {
    subject:
      '{name, select, null {Someone} other {{name}}} declined your invitation to {group}',
    preheader:
      '{name, select, null {Someone} other {{name}}} declined your invitation to {group}',
    heading: 'Invitation declined',
    subheading: "Heads up — your invitation wasn't accepted",
    body: '{firstName, select, null {Hi there,} other {Hi {firstName},}} {name, select, null {someone} other {**{name}**}} declined your invitation to join **{group}**.',
    note: 'You can always invite someone else from the group settings whenever you want.',
  },
  memberLeft: {
    subject: '{name, select, null {A member} other {{name}}} left {group}',
    preheader: '{name, select, null {A member} other {{name}}} left {group}',
    greeting: '{firstName, select, null {Hi there,} other {Hi {firstName},}}',
    heading: 'A member left your group',
    subheading:
      '{name, select, null {A member} other {{name}}} is no longer in {group}',
    cardRole: 'Was a member of {group}',
    body: '{name, select, null {A member} other {**{name}**}} left **{group}**. Their data and posts remain visible to current members; only their access has been revoked.',
    cta: 'Open group',
  },
  memberRemoved: {
    subject: 'You were removed from {group}',
    preheader: 'You were removed from {group}',
    greeting: '{firstName, select, null {Hi there,} other {Hi {firstName},}}',
    heading: 'You were removed from a group',
    subheading: 'Your membership in {group} ended',
    body: "You've been removed from **{group}**. You no longer have access to its sessions, members or posts.",
    cta: 'Browse groups',
    note: 'If you think this was a mistake, reach out to the group owner directly to sort it out.',
  },
  joinRequestReceived: {
    subject:
      '{name, select, null {Someone} other {{name}}} wants to join {group}',
    preheader:
      '{name, select, null {Someone} other {{name}}} wants to join {group}',
    eyebrow: 'JOIN REQUEST',
    greeting: '{firstName, select, null {Hi there,} other {Hi {firstName},}}',
    heading: 'New request to join your group',
    subheading:
      '{name, select, null {Someone} other {{name}}} wants to join {group}',
    cardRole: 'Wants to join your group',
    body: '{name, select, null {Someone} other {**{name}**}} requested to join **{group}**. Review their profile and approve or decline.',
    /** The requester's own words, shown as a quote in the HTML email. */
    quote: '"{message}"',
    /** The same message in the plain-text email, where it needs a label. */
    message: 'Message: "{message}"',
    cta: 'Review request',
  },
  joinRequestDecided: {
    greeting: '{firstName, select, null {Hi there,} other {Hi {firstName},}}',
    approved: {
      subject: "You're in — {group} accepted your request",
      preheader: 'Your request to join {group} was approved',
      eyebrow: 'REQUEST APPROVED',
      heading: "You're in!",
      subheading: 'The owner approved your request to join {group}',
      body: "You're now a member of **{group}**. Jump in to see the latest posts, sessions and people.",
      cta: 'Open group',
      closing: 'Welcome aboard.',
    },
    rejected: {
      subject: 'Update on your request to join {group}',
      preheader: 'Update on your request to join {group}',
      heading: 'Request update',
      subheading: "The owner of {group} couldn't add you this time",
      body: "The owner of **{group}** declined your request to join. This isn't personal — sometimes groups are full, paused, or only accepting people they already know.",
      cta: 'Find another group',
      note: 'You can request to join again later if the group opens up.',
    },
  },
  /**
   * One email per side of a transfer. `received` goes to the new owner
   * (`name` is who handed the group over), `transferred` to the old one
   * (`name` is who took it). Both sides have the same parts.
   */
  ownershipTransferred: {
    greeting: '{firstName, select, null {Hi there,} other {Hi {firstName},}}',
    received: {
      subject:
        '{name, select, null {The previous owner} other {{name}}} transferred {group} to you',
      preheader:
        '{name, select, null {The previous owner} other {{name}}} transferred {group} to you',
      eyebrow: 'YOU ARE THE NEW OWNER',
      heading: "You're now the owner of {group}",
      subheading:
        '{name, select, null {The previous owner} other {{name}}} handed the group over to you',
      cardRole: 'Previous owner',
      body: '{name, select, null {The previous owner} other {**{name}**}} transferred ownership of **{group}** to you. You now have full control over members, settings, sessions and posts.',
      cta: 'Manage your group',
      closing:
        'You can always transfer ownership again later from the group settings.',
    },
    transferred: {
      subject: 'You transferred ownership of {group}',
      preheader:
        'You transferred ownership of {group}{name, select, null {} other { to {name}}}',
      eyebrow: 'OWNERSHIP TRANSFERRED',
      heading: 'You transferred {group}',
      subheading:
        '{name, select, null {The group has a new owner} other {{name} is now the owner}}',
      cardRole: 'New owner',
      body: 'You transferred ownership of **{group}**{name, select, null {} other { to **{name}**}}. You remain a member of the group, but {name, select, null {the new owner} other {{name}}} now controls members, settings, sessions and posts.',
      cta: 'Open group',
      closing:
        'Thanks for keeping the group active. If you want a leadership role again, the new owner can make you a moderator or transfer the group back to you.',
    },
  },
  roleChanged: {
    subject:
      'Your role in {group} changed to {role, select, OWNER {Owner} MODERATOR {Moderator} other {Member}}',
    preheader:
      'Your role in {group} changed to {role, select, OWNER {Owner} MODERATOR {Moderator} other {Member}}',
    eyebrow: 'ROLE UPDATED',
    greeting: '{firstName, select, null {Hi there,} other {Hi {firstName},}}',
    heading: 'Your role changed',
    subheading: 'Your role in {group} was updated',
    groupLabel: 'Group',
    wasLabel: 'Was',
    nowLabel: 'Now',
    /** A role as a label: the chips in the HTML card, the detail rows in text. */
    role: '{role, select, OWNER {Owner} MODERATOR {Moderator} other {Member}}',
    body: 'The group owner updated your role in **{group}**.',
    cta: 'Open group',
  },
};
