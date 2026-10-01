import type { Catalog } from '../..';

export const waitlist: Catalog['email']['waitlist'] = {
  confirmation: {
    subject: 'Ești pe lista MotionHive!',
    preheader: 'Ești pe lista MotionHive!',
    eyebrow: 'EȘTI PE LISTĂ',
    heading: 'Ești pe listă!',
    subheading: 'Mulțumim că te interesează MotionHive',
    intro:
      '{name, select, null {Salut!} other {Salut, {name}!}} Ne bucurăm mult că vrei să faci parte din comunitatea MotionHive.',
    building:
      'Lucrăm din greu la o platformă care face mișcarea mai accesibilă, mai sociabilă și mai plăcută. Vei afla **printre primii** când lansăm.',
    next: '**Ce urmează?** Îți trimitem o invitație de îndată ce deschidem accesul timpuriu. Rămâi aproape!',
    follow: 'Până atunci, urmărește-ne ca să vezi noutăți și ce mai pregătim.',
    footerNote:
      'Primești acest email pentru că te-ai înscris pe lista MotionHive.',
  },
};
