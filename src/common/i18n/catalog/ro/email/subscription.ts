import type { Catalog } from '../..';

export const subscription: Catalog['email']['subscription'] = {
  setup: {
    subject:
      '{instructor, select, null {Antrenorul tău} other {{instructor}}} ți-a creat abonamentul „{plan}”. Confirmă-l ca să înceapă',
    preheader:
      '{instructor, select, null {Antrenorul tău} other {{instructor}}} ți-a creat abonamentul „{plan}”. Confirmă-l ca să înceapă.',
    eyebrow: 'CONFIRMĂ ABONAMENTUL',
    greeting: '{name, select, null {Salut!} other {Salut, {name}!}}',
    heading: 'Confirmă-ți abonamentul',
    subheading:
      '{instructor, select, null {Antrenorul tău} other {{instructor}}} ți-a creat un abonament cu plată recurentă',
    planLabel: 'Abonament',
    fromLabel: 'De la',
    fromFallback: 'Antrenorul tău',
    amountLabel: 'Preț',
    billedLabel: 'Se plătește',
    billedValue:
      '{interval, select, day {{count, plural, one {zilnic} few {o dată la # zile} other {o dată la # de zile}}} week {{count, plural, one {săptămânal} few {o dată la # săptămâni} other {o dată la # de săptămâni}}} month {{count, plural, one {lunar} few {o dată la # luni} other {o dată la # de luni}}} year {{count, plural, one {anual} few {o dată la # ani} other {o dată la # de ani}}} other {}}',
    body: 'Apasă mai jos ca să confirmi și să-ți începi abonamentul. Poți plăti cu un card salvat sau cu unul nou și poți anula oricând din contul tău.',
    cta: 'Confirmă și începe abonamentul',
    security:
      'Dacă nu te așteptai la acest email, îl poți ignora. Nu plătești nimic până nu confirmi. Plata se face în siguranță prin Stripe.',
    footerNote:
      'Primești acest email pentru că un antrenor a creat un abonament pentru această adresă pe MotionHive. Nu plătești nimic până nu confirmi.',
  },
};
