import type { Catalog } from '../..';

export const profile: Catalog['errors']['profile'] = {
  notFound: 'Nu am găsit profilul.',
  coachNotFound: 'Nu am găsit profilul de antrenor.',
  coachProfileExists: 'Ai deja un profil de antrenor.',
  noCoachProfile: 'Nu ai încă un profil de antrenor. Creează-l mai întâi.',
  handleTaken: 'Numele de utilizator e deja luat.',
};
