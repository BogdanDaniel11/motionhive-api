import type { Catalog } from '../..';

export const layout: Catalog['email']['layout'] = {
  eyebrow: {
    action: 'ACȚIUNE NECESARĂ',
    confirmation: 'CONFIRMAT',
    update: 'NOUTĂȚI',
    time: 'REAMINTIRE',
    request: 'CERERE',
  },
  footer: {
    terms: 'Termeni și condiții',
    privacy: 'Politica de confidențialitate',
    cookies: 'Politica de cookie-uri',
    rightsReserved: 'Toate drepturile rezervate.',
  },
  openApp: 'Deschide MotionHive',
  headsUp: 'De știut',
};
