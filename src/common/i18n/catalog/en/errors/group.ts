export const group = {
  createFailed: "We couldn't create the group. Try again.",
  notFound: 'Group not found.',
  notPublic: 'Group not found or is not public.',
  notMember: 'You are not a member of this group.',
  alreadyMember: 'You are already a member of this group.',
  ownerOnly: 'Only the group owner can do this.',
  ownerCannotLeave:
    'Group owner cannot leave. Transfer ownership first or delete the group.',
  memberNotFound: 'Member not found.',
  cannotRemoveOwner: 'Cannot remove the group owner.',
  invitationRequired:
    'This group is not public. You need an invitation to join.',
  inviteOnly: 'This group requires an invitation to join.',
  joinRequestNotFound: 'Join request not found.',
  joinRequestAlreadyDecided:
    'This request is already {status, select, APPROVED {approved} REJECTED {rejected} CANCELLED {cancelled} other {answered}}.',
  joinLinkInvalid: 'Invalid or expired join link.',
  joinLinkExpired:
    'This join link has expired. Ask the group owner for a new one.',
  alreadyOwner: 'You are already the owner.',
  newOwnerNotMember: 'New owner must be an active member of the group.',
  cannotChangeOwnRole: 'Use transfer ownership to change your own role.',
  targetNotMember: 'This person is not a member of this group.',
  cannotChangeOwnerRole:
    "You can't change the owner's role here. Use transfer ownership instead.",
};
