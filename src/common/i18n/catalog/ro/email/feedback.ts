import type { Catalog } from '../..';

export const feedback: Catalog['email']['feedback'] = {
  confirmation: {
    subject: 'Mulțumim pentru feedback!',
    preheader: 'Mulțumim pentru feedback!',
    eyebrow: 'FEEDBACK PRIMIT',
    heading: 'Am primit feedbackul tău',
    subheading: 'Ne bucurăm că ți-ai făcut timp să ne scrii',
    intro:
      '{name, select, null {Salut!} other {Salut, {name}!}} {type, select, BUG {Îți mulțumim că ne-ai semnalat problema.} SUGGESTION {Îți mulțumim pentru sugestie.} other {Îți mulțumim pentru feedback.}} Fiecare mesaj ne ajută să facem platforma mai bună.',
    titleLabel:
      '{type, select, BUG {Problema semnalată} SUGGESTION {Sugestia ta} other {Mesajul tău}}',
    review:
      'Echipa noastră citește tot ce primim. Nu putem răspunde fiecărui mesaj în parte, dar ce ne scrii influențează direct ce construim mai departe.',
    thanks: 'Mulțumim că ne ajuți să facem MotionHive mai bun!',
    footerNote:
      'Primești acest email pentru că ne-ai trimis feedback pe MotionHive.',
  },
};
