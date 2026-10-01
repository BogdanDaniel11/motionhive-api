import type { Catalog } from '../..';

export const waitlist: Catalog['email']['waitlist'] = {
  confirmation: {
    subject: 'Ești pe lista MotionHive!',
    preheader:
      'MotionHive e deja disponibil. Și vei fi printre primii care află când apare aplicația de mobil.',
    eyebrow: 'EȘTI PE LISTĂ',
    heading: 'Ești pe listă!',
    subheading: 'Mulțumim că te interesează MotionHive',
    intro:
      '{name, select, null {Salut!} other {Salut, {name}!}} Ne bucurăm mult că vrei să faci parte din comunitatea MotionHive.',
    live: 'MotionHive e deja disponibil: îți poți face cont chiar azi ca să rezervi sesiuni, să lucrezi cu antrenori și să-ți urmărești antrenamentele.',
    cta: 'Fă-ți cont',
    next: '**Ce urmează?** Pregătim aplicația de mobil și vei afla **printre primii** când e gata.',
    footerNote:
      'Primești acest email pentru că te-ai înscris pe lista MotionHive.',
  },
};
