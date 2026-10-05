import type { Catalog } from '../..';

export const exercise: Catalog['errors']['exercise'] = {
  notFound: 'Nu am găsit exercițiul.',
  cannotForkOwn:
    'Nu îți poți copia propriul exercițiu în bibliotecă. Folosește „Duplică”.',
  alreadyForked: 'Ai deja o copie a acestui exercițiu în bibliotecă.',
  primaryMuscleRequired: 'Alege cel puțin un mușchi principal.',
  tooManyPrimaryMuscles:
    'Alege cel mult {max, plural, one {un mușchi principal} few {# mușchi principali} other {# de mușchi principali}}.',
  duplicateMuscle:
    'Același mușchi apare de două ori în aceeași listă. Șterge duplicatul.',
  tooManyWithName: 'Ai prea multe exerciții cu acest nume. Alege alt nume.',
};
