import type { Catalog } from '../..';

export const group: Catalog['email']['group'] = {
  invitation: {
    subject:
      'Ai primit o invitație să intri în grupul „{group}” de pe MotionHive',
    preheader:
      '{name, select, null {Ai primit o invitație să intri} other {{name} te invită să intri}} în grupul „{group}”',
    eyebrow: 'INVITAȚIE',
    heading: 'Ai primit o invitație!',
    subheading:
      '{name, select, null {Cineva} other {{name}}} vrea să faci parte din echipa sa',
    cardRole: 'Ți-a trimis o invitație',
    body: '{name, select, null {Ai primit o invitație să intri} other {**{name}** te invită să intri}} în grupul **{group}** de pe MotionHive, o platformă de fitness pentru antrenori și clienți.',
    quote: '„{message}”',
    message: 'Mesaj personal: „{message}”',
    cta: 'Acceptă invitația',
    detail:
      'Dacă accepți, faci parte din grupul **{group}** și poți participa la sesiunile de antrenament.',
    expiry: 'Invitația expiră în **7 zile**.',
    security:
      'Dacă nu cunoști persoana care ți-a trimis invitația, poți ignora acest email.',
  },
  invitationAccepted: {
    subject:
      '{name, select, null {Cineva} other {{name}}} ți-a acceptat invitația în {group, select, null {grupul tău} other {grupul „{group}”}}',
    preheader:
      '{name, select, null {Cineva} other {{name}}} ți-a acceptat invitația în {group, select, null {grupul tău} other {grupul „{group}”}}',
    eyebrow: 'INVITAȚIE ACCEPTATĂ',
    heading: 'Invitație acceptată!',
    subheading: 'Vești bune: cineva a intrat în grupul tău',
    body: '{firstName, select, null {Salut!} other {Salut, {firstName}!}} {name, select, null {Cineva} other {**{name}**}} ți-a acceptat invitația și face acum parte din {group, select, null {grupul tău} other {grupul **{group}**}}.',
    cta: 'Deschide MotionHive',
    detail: 'Poți vedea membrii grupului în aplicația MotionHive.',
  },
  invitationDeclined: {
    subject:
      '{name, select, null {Cineva} other {{name}}} ți-a refuzat invitația în grupul „{group}”',
    preheader:
      '{name, select, null {Cineva} other {{name}}} ți-a refuzat invitația în grupul „{group}”',
    heading: 'Invitație refuzată',
    subheading: 'De știut: invitația ta nu a fost acceptată',
    body: '{firstName, select, null {Salut!} other {Salut, {firstName}!}} {name, select, null {Cineva} other {**{name}**}} a refuzat invitația ta de a intra în grupul **{group}**.',
    note: 'Poți invita oricând pe altcineva, din setările grupului.',
  },
  memberLeft: {
    subject:
      '{name, select, null {Un membru} other {{name}}} a părăsit grupul „{group}”',
    preheader:
      '{name, select, null {Un membru} other {{name}}} a părăsit grupul „{group}”',
    greeting: '{firstName, select, null {Salut!} other {Salut, {firstName}!}}',
    heading: 'Un membru a părăsit grupul',
    subheading:
      '{name, select, null {Un membru} other {{name}}} nu mai face parte din grupul „{group}”',
    cardRole: 'A făcut parte din grupul „{group}”',
    body: '{name, select, null {Un membru} other {**{name}**}} a părăsit grupul **{group}**. Ce a postat rămâne vizibil pentru membrii actuali; doar accesul la grup i-a fost retras.',
    cta: 'Deschide grupul',
  },
  memberRemoved: {
    subject: 'Administratorul te-a scos din grupul „{group}”',
    preheader: 'Administratorul te-a scos din grupul „{group}”',
    greeting: '{firstName, select, null {Salut!} other {Salut, {firstName}!}}',
    heading: 'Nu mai ai acces la grup',
    subheading: 'Accesul tău la grupul „{group}” s-a încheiat',
    body: 'Administratorul te-a scos din grupul **{group}**. Nu mai ai acces la sesiunile, membrii și postările grupului.',
    cta: 'Vezi grupurile',
    note: 'Dacă crezi că e o greșeală, scrie-i direct administratorului grupului ca să lămuriți lucrurile.',
  },
  joinRequestReceived: {
    subject:
      '{name, select, null {Cineva} other {{name}}} vrea să intre în grupul „{group}”',
    preheader:
      '{name, select, null {Cineva} other {{name}}} vrea să intre în grupul „{group}”',
    eyebrow: 'CERERE DE INTRARE',
    greeting: '{firstName, select, null {Salut!} other {Salut, {firstName}!}}',
    heading: 'Cerere nouă de intrare în grupul tău',
    subheading:
      '{name, select, null {Cineva} other {{name}}} vrea să intre în grupul „{group}”',
    cardRole: 'Vrea să intre în grupul tău',
    body: '{name, select, null {Cineva} other {**{name}**}} a cerut să intre în grupul **{group}**. Vezi profilul, apoi aprobă sau respinge cererea.',
    quote: '„{message}”',
    message: 'Mesaj: „{message}”',
    cta: 'Vezi cererea',
  },
  joinRequestDecided: {
    greeting: '{firstName, select, null {Salut!} other {Salut, {firstName}!}}',
    approved: {
      subject: 'Cererea ta a fost aprobată: faci parte din grupul „{group}”',
      preheader: 'Cererea ta de a intra în grupul „{group}” a fost aprobată',
      eyebrow: 'CERERE APROBATĂ',
      heading: 'Ești în grup!',
      subheading:
        'Administratorul ți-a aprobat cererea de a intra în grupul „{group}”',
      body: 'Faci parte acum din grupul **{group}**. Intră să vezi cele mai noi postări, sesiunile și oamenii din grup.',
      cta: 'Deschide grupul',
      closing: 'Bine ai venit!',
    },
    rejected: {
      subject: 'Răspuns la cererea ta de a intra în grupul „{group}”',
      preheader: 'Răspuns la cererea ta de a intra în grupul „{group}”',
      heading: 'Răspuns la cererea ta',
      subheading:
        'Administratorul grupului „{group}” nu te-a putut primi de data aceasta',
      body: 'Administratorul grupului **{group}** ți-a respins cererea. Nu e nimic personal: uneori grupurile sunt pline, sunt în pauză sau primesc doar oameni pe care îi cunosc deja.',
      cta: 'Caută alt grup',
      note: 'Poți trimite o cerere nouă mai târziu, dacă situația grupului se schimbă.',
    },
  },
  ownershipTransferred: {
    greeting: '{firstName, select, null {Salut!} other {Salut, {firstName}!}}',
    received: {
      subject:
        '{name, select, null {Ai primit administrarea grupului „{group}”} other {{name} ți-a predat administrarea grupului „{group}”}}',
      preheader:
        '{name, select, null {Ai primit administrarea grupului „{group}”} other {{name} ți-a predat administrarea grupului „{group}”}}',
      eyebrow: 'ACUM ADMINISTREZI GRUPUL',
      heading: 'Ești acum administratorul grupului „{group}”',
      subheading:
        '{name, select, null {Grupul a trecut în administrarea ta} other {{name} ți-a predat grupul}}',
      cardRole: 'A administrat grupul până acum',
      body: '{name, select, null {Ai primit administrarea grupului **{group}**} other {**{name}** ți-a predat administrarea grupului **{group}**}}. De acum, tu decizi tot ce ține de membri, setări, sesiuni și postări.',
      cta: 'Administrează grupul',
      closing:
        'Poți preda oricând administrarea mai departe, din setările grupului.',
    },
    transferred: {
      subject: 'Ai predat administrarea grupului „{group}”',
      preheader:
        'Ai predat administrarea grupului „{group}”{name, select, null {} other {. De acum îl administrează {name}}}',
      eyebrow: 'ADMINISTRARE PREDATĂ',
      heading: 'Ai predat grupul „{group}”',
      subheading:
        '{name, select, null {Grupul are un nou administrator} other {{name} administrează acum grupul}}',
      cardRole: 'Administrează acum grupul',
      body: 'Ai predat administrarea grupului **{group}**. Rămâi în grup ca membru, dar de acum {name, select, null {noul administrator} other {**{name}**}} se ocupă de membri, setări, sesiuni și postări.',
      cta: 'Deschide grupul',
      closing:
        'Mulțumim că ai ținut grupul activ. Dacă vrei din nou un rol de conducere, cine administrează acum grupul te poate face moderator sau îți poate preda grupul înapoi.',
    },
  },
  roleChanged: {
    subject:
      'Ești acum {role, select, OWNER {administrator} MODERATOR {moderator} other {membru obișnuit}} în grupul „{group}”',
    preheader:
      'Ești acum {role, select, OWNER {administrator} MODERATOR {moderator} other {membru obișnuit}} în grupul „{group}”',
    eyebrow: 'ROL SCHIMBAT',
    greeting: '{firstName, select, null {Salut!} other {Salut, {firstName}!}}',
    heading: 'Rolul tău s-a schimbat',
    subheading: 'Ai un rol nou în grupul „{group}”',
    groupLabel: 'Grup',
    wasLabel: 'Înainte',
    nowLabel: 'Acum',
    role: '{role, select, OWNER {Administrator} MODERATOR {Moderator} other {Membru}}',
    body: 'Administratorul ți-a schimbat rolul în grupul **{group}**.',
    cta: 'Deschide grupul',
  },
};
