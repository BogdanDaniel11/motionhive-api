import type { Catalog } from '../..';

export const auth: Catalog['email']['auth'] = {
  verification: {
    subject: 'Confirmă-ți adresa de email pentru MotionHive',
    preheader:
      'Confirmă-ți adresa de email ca să începi să folosești MotionHive',
    heading: 'Confirmă-ți adresa de email',
    subheading: 'Un singur pas și ești gata',
    body: 'Mulțumim că ți-ai făcut cont pe MotionHive! Confirmă-ți adresa de email ca să poți folosi toată aplicația.',
    cta: 'Confirmă adresa de email',
    expiry: 'Linkul de confirmare expiră în **24 de ore**.',
    security:
      'Dacă nu tu ai creat un cont MotionHive, poți ignora acest email.',
  },
  welcome: {
    subject: 'Bine ai venit pe MotionHive!',
    preheader: 'Bine ai venit pe MotionHive, {name}!',
    eyebrow: 'BINE AI VENIT',
    heading: 'Bine ai venit, {name}!',
    subheading: 'Poți începe să faci mai multă mișcare, în ritmul tău',
    intro: 'Contul tău MotionHive e gata. Iată ce poți face:',
    featureSessions:
      '**Participă la sesiuni.** Găsește sesiuni care se potrivesc cu obiectivele tale.',
    featureCoaches:
      '**Lucrează cu antrenori.** Primește îndrumare personalizată.',
    featureOrganize:
      '**Organizează-ți propriile sesiuni.** Creează sesiuni și adună oameni în jurul tău.',
    cta: 'Deschide MotionHive',
    help: 'Ai nevoie de ajutor? Răspunde la acest email și te ajutăm cu drag.',
  },
  passwordReset: {
    subject: 'Resetează-ți parola MotionHive',
    preheader: 'Resetează-ți parola MotionHive',
    heading: 'Resetează-ți parola',
    subheading: 'Am primit o cerere de resetare a parolei',
    body: 'Apasă pe butonul de mai jos ca să alegi o parolă nouă. Dacă nu tu ai făcut cererea, poți ignora acest email, iar parola ta rămâne aceeași.',
    cta: 'Resetează parola',
    expiry:
      'Linkul de resetare expiră **într-o oră** și poate fi folosit o singură dată.',
    security:
      'Dacă nu tu ai cerut resetarea parolei, probabil cineva ți-a introdus adresa din greșeală. Contul tău nu a fost modificat.',
  },
  passwordChanged: {
    subject: 'Parola ta MotionHive a fost schimbată',
    preheader: 'Parola ta MotionHive tocmai a fost schimbată',
    eyebrow: 'SECURITATE',
    heading: 'Parola ta a fost schimbată',
    subheading: 'Am observat o schimbare de parolă în contul tău',
    body: '{name, select, null {Salut!} other {Salut, {name}!}} Parola ta MotionHive a fost schimbată **{when}**. Dacă tu ai făcut schimbarea, nu trebuie să faci nimic. Pentru siguranță, te-am deconectat de pe toate celelalte dispozitive.',
    warning:
      'Dacă nu tu ai schimbat parola, e posibil ca altcineva să aibă acces la contul tău. Resetează parola acum ca să-l protejezi.',
    cta: 'Resetează parola',
    help: 'Ai nevoie de ajutor? Răspunde la acest email și te ajutăm cu drag.',
  },
};
