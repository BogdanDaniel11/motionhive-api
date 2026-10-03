import type { Catalog } from '../..';

export const social: Catalog['email']['social'] = {
  friendInvite: {
    subject:
      '{inviter, select, null {Ai primit o invitație pe MotionHive} other {{inviter} te-a invitat pe MotionHive}}',
    preheader:
      '{inviter, select, null {Ai primit o invitație pe MotionHive} other {{inviter} te-a invitat pe MotionHive}}',
    eyebrow: 'INVITAȚIE',
    heading: 'Hai să ne antrenăm împreună pe MotionHive',
    subheading:
      '{inviter, select, null {Cineva care te cunoaște} other {{inviter}}} crede că o să-ți placă aici',
    anonymous: 'Cineva care te cunoaște',
    cardRole: 'Ți-a trimis o invitație',
    body: '**{inviter, select, null {Cineva care te cunoaște} other {{inviter}}}** folosește MotionHive ca să găsească antrenori, să rezerve sesiuni și să-și urmărească antrenamentele. S-a gândit că ți-ar plăcea și ție.',
    message: '„{message}”',
    messageText: 'Mesaj: „{message}”',
    cta: 'Vino pe MotionHive',
    security: 'Dacă nu te așteptai la acest email, îl poți ignora.',
  },
  instructorSuggestion: {
    subject:
      '{recommender, select, null {Cineva care folosește MotionHive ți-a sugerat să vii și tu} other {{recommender} ți-a sugerat să vii pe MotionHive}}',
    preheader:
      '{recommender, select, null {Cineva care folosește MotionHive ți-a sugerat să vii și tu} other {{recommender} ți-a sugerat să vii pe MotionHive}}',
    eyebrow: 'RECOMANDARE',
    heading: 'Salut, {coach}! Cineva crede că te-ai potrivi de minune aici',
    subheading:
      '{recommender, select, null {Cineva care folosește MotionHive ți-a sugerat să vii și tu} other {{recommender} ți-a sugerat să vii pe MotionHive}}',
    anonymous: 'Cineva de pe MotionHive',
    cardRole: 'Te-a recomandat',
    body: '**{recommender, select, null {Cineva} other {{recommender}}}** folosește MotionHive și te-a recomandat: crede că locul tău e printre antrenorii de pe platformă. Ne-am bucura să te avem alături.',
    note: '„{note}”',
    noteText: 'Mesaj: „{note}”',
    cta: 'Creează-ți profilul de antrenor',
    security: 'Dacă nu e pentru tine, nicio problemă. Poți ignora acest email.',
  },
};
