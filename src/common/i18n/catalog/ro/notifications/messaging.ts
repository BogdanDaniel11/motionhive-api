import type { Catalog } from '../..';

export const messaging: Catalog['notifications']['messaging'] = {
  received: {
    title:
      '{name, select, null {Ai un mesaj nou} other {Mesaj nou de la {name}}}',
    body: '{name, select, null {Mesaj nou} other {{name}}}: {preview}',
    cta: 'Deschide conversația',
  },
  receivedPrivate: {
    title:
      '{name, select, null {Ai un mesaj nou} other {Mesaj nou de la {name}}}',
    body: '{name, select, null {Ai primit un mesaj nou.} other {{name} ți-a trimis un mesaj.}}',
    cta: 'Deschide conversația',
  },
};
