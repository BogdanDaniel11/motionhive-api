import type { Catalog } from '../..';

export const notification: Catalog['errors']['notification'] = {
  notFound: 'Nu am găsit notificarea.',
  deviceNotFound: 'Nu am găsit dispozitivul.',
  deviceTokenMissing:
    'Nu am putut activa notificările pe acest dispozitiv. Încearcă din nou.',
};
