import type { Catalog } from '../..';

export const invoice: Catalog['email']['invoice'] = {
  send: {
    subject:
      '{ref, select, null {Factură} other {Factura {ref}}} de la {instructor, select, null {antrenorul tău} other {{instructor}}}',
    preheader:
      '{instructor, select, null {Antrenorul tău} other {{instructor}}} ți-a trimis o factură de {amount}',
    eyebrow: 'FACTURĂ',
    greeting: '{name, select, null {Salut!} other {Salut, {name}!}}',
    heading: 'Ai o factură nouă',
    subheading:
      '{instructor, select, null {Antrenorul tău} other {{instructor}}} ți-a trimis o factură pe MotionHive',
    numberLabel: 'Număr factură',
    fromLabel: 'De la',
    fromFallback: 'Antrenorul tău',
    amountLabel: 'Total de plată',
    dueLabel: 'Scadență',
    cta: 'Vezi și plătește factura',
    pdfCta: 'Descarcă PDF',
    stripe: 'Plata se face în siguranță prin Stripe.',
    footerNote:
      'Primești acest email pentru că o factură a fost trimisă la această adresă prin MotionHive.',
  },
};
