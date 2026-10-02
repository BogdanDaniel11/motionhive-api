export const post = {
  pendingApproval: {
    title: 'A post needs your review',
    body: '{name, select, null {A member} other {{name}}} posted{group, select, null {} other { in "{group}"}}. Review it from the group.',
  },
  approved: {
    title: 'Your post was approved',
    body: 'Your post{group, select, null {} other { in "{group}"}} is now visible to the group.',
  },
  rejected: {
    title: 'Your post was not approved',
    body: 'A moderator removed your post{group, select, null {} other { in "{group}"}}.',
  },
  newComment: {
    title: 'New comment on your post',
    body: '{name, select, null {Someone} other {{name}}} commented on your post{group, select, null {} other { in "{group}"}}.',
  },
};
