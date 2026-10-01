import type { Catalog } from '../..';

export const client: Catalog['email']['client'] = {
  invitationNewUser: {
    subject: '{name} te-a invitat pe MotionHive',
    preheader: '{name} te-a invitat pe MotionHive',
    eyebrow: 'INVITAȚIE',
    heading: 'Ai primit o invitație!',
    subheading: '{name} te invită pe MotionHive ca să te antreneze',
    personRole: 'Antrenor',
    body: '**{name}** îți propune să te antreneze și te invită să-ți faci cont pe MotionHive.',
    messageQuote: '„{message}”',
    messageLine: 'Mesaj: „{message}”',
    cta: 'Fă-ți cont pe MotionHive',
    security:
      'Dacă ai deja cont, intră în cont și invitația te așteaptă acolo.',
  },
  invitationExistingUser: {
    subject: '{name} vrea să te adauge printre clienții săi pe MotionHive',
    preheader: '{name} vrea să te adauge printre clienții săi pe MotionHive',
    eyebrow: 'INVITAȚIE',
    greeting: '{recipient, select, null {Salut,} other {Salut, {recipient},}}',
    heading: '{name} îți propune să te antreneze',
    personRole: 'Antrenor',
    body: '**{name}** vrea să te adauge printre clienții săi pe MotionHive. Dacă accepți, puteți gestiona împreună, în aplicație, sesiunile, abonamentele și facturile.',
    messageQuote: '„{message}”',
    messageLine: 'Mesaj: „{message}”',
    ctaAccept: 'Acceptă',
    ctaDecline: 'Refuză',
    security:
      'Dacă nu te așteptai la această invitație, poți ignora emailul sau o poți refuza din contul tău.',
  },
  requestToInstructor: {
    subject: '{name} vrea să te aibă ca antrenor pe MotionHive',
    preheader: '{name} vrea să te aibă ca antrenor pe MotionHive',
    eyebrow: 'CERERE NOUĂ',
    greeting: '{recipient, select, null {Salut,} other {Salut, {recipient},}}',
    heading: 'Cineva vrea să te aibă ca antrenor',
    personRole: 'Ți-a trimis o cerere',
    body: '**{name}** vrea să te aibă ca antrenor.',
    messageQuote: '„{message}”',
    messageLine: 'Mesaj: „{message}”',
    ctaAccept: 'Acceptă cererea',
    ctaDecline: 'Refuză',
  },
  requestAccepted: {
    subject: '{name} ți-a acceptat cererea pe MotionHive',
    preheader: '{name} ți-a acceptat cererea pe MotionHive',
    eyebrow: 'CERERE ACCEPTATĂ',
    greeting: '{recipient, select, null {Salut,} other {Salut, {recipient},}}',
    heading: 'Cererea ta a fost acceptată',
    personRole: 'Ți-a acceptat cererea',
    body: '**{name}** ți-a acceptat cererea. De acum puteți gestiona împreună, în aplicație, sesiunile, abonamentele și facturile.',
    cta: 'Deschide MotionHive',
  },
  requestDeclined: {
    subject: 'Ai primit un răspuns la cererea ta de pe MotionHive',
    preheader: 'Ai primit un răspuns la cererea ta de pe MotionHive',
    greeting: '{recipient, select, null {Salut,} other {Salut, {recipient},}}',
    heading: 'Răspuns la cererea ta',
    body: '**{name}** nu îți poate accepta cererea în acest moment.',
    note: 'Când vrei, poți căuta alte variante pe MotionHive.',
  },
  collaborationEnded: {
    heading: 'Nu vă mai antrenați împreună',
    client: {
      self: {
        subject: 'Nu te mai antrenezi cu {name}',
        body: '{recipient, select, null {Salut!} other {Salut, {recipient}!}} Ai ales să nu te mai antrenezi cu **{name}** pe MotionHive. Nu mai apare în lista ta de antrenori și nu te mai poate invita la sesiuni.',
      },
      other: {
        subject: '{name} nu te mai antrenează',
        body: '{recipient, select, null {Salut!} other {Salut, {recipient}!}} **{name}** a ales să nu te mai antreneze pe MotionHive. Nu mai apare în lista ta de antrenori.',
      },
      membershipNote:
        'Dacă ai un abonament activ, el rămâne activ până când îl anulezi din profilul tău, din secțiunea Abonamente.',
      reconnect: 'Poți relua oricând legătura trimițând o cerere nouă.',
      footerNote:
        'Primești acest email pentru că s-a schimbat lista ta de antrenori de pe MotionHive.',
    },
    instructor: {
      self: {
        subject: '{name} nu mai face parte dintre clienții tăi',
        body: '{recipient, select, null {Salut!} other {Salut, {recipient}!}} Ai ales să nu mai continui antrenamentele cu **{name}** pe MotionHive. Nu mai apare în lista ta de clienți și nu mai poate vedea sesiunile tale doar pentru clienți.',
      },
      other: {
        subject: '{name} nu se mai antrenează cu tine',
        body: '{recipient, select, null {Salut!} other {Salut, {recipient}!}} **{name}** a ales să nu se mai antreneze cu tine pe MotionHive. Nu mai apare în lista ta de clienți.',
      },
      membershipNote:
        'Abonamentele active dintre voi rămân valabile până când le anulează unul dintre voi. Faptul că nu vă mai antrenați împreună nu le anulează automat.',
      reconnect: 'Poți relua oricând legătura trimițând o invitație nouă.',
      footerNote:
        'Primești acest email pentru că s-a schimbat lista ta de clienți de pe MotionHive.',
    },
  },
};
