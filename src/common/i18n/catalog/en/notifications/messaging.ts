export const messaging = {
  received: {
    title: 'New message from {name, select, null {Someone} other {{name}}}',
    body: '{name, select, null {Someone} other {{name}}}: {preview}',
    cta: 'Open conversation',
  },
  /** The reader has turned message previews off in emails. */
  receivedPrivate: {
    title: 'New message from {name, select, null {Someone} other {{name}}}',
    body: '{name, select, null {Someone} other {{name}}} sent you a new message.',
    cta: 'Open conversation',
  },
};
