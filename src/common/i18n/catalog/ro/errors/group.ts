import type { Catalog } from '../..';

export const group: Catalog['errors']['group'] = {
  createFailed: 'Nu am putut crea grupul. Încearcă din nou.',
  notFound: 'Nu am găsit grupul.',
  notPublic: 'Nu am găsit grupul sau acesta nu este public.',
  notMember: 'Nu faci parte din acest grup.',
  alreadyMember: 'Faci deja parte din acest grup.',
  ownerOnly: 'Doar administratorul grupului poate face asta.',
  ownerCannotLeave:
    'Administratorul nu poate părăsi grupul. Transferă mai întâi rolul de administrator altui membru sau șterge grupul.',
  memberNotFound: 'Nu am găsit acest membru.',
  cannotRemoveOwner: 'Nu poți elimina administratorul grupului.',
  invitationRequired:
    'Acest grup nu este public. Ai nevoie de o invitație ca să intri.',
  inviteOnly: 'În acest grup se intră doar cu invitație.',
  joinRequestNotFound: 'Nu am găsit cererea de intrare în grup.',
  joinRequestAlreadyDecided:
    'Această cerere a fost deja {status, select, APPROVED {aprobată} REJECTED {respinsă} CANCELLED {anulată} other {procesată}}.',
  joinLinkInvalid: 'Linkul de alăturare nu este valid sau a expirat.',
  joinLinkExpired:
    'Acest link de alăturare a expirat. Cere-i administratorului unul nou.',
  alreadyOwner: 'Ai deja rolul de administrator în acest grup.',
  newOwnerNotMember: 'Noul administrator trebuie să fie membru al grupului.',
  cannotChangeOwnRole:
    'Ca să-ți schimbi propriul rol, transferă rolul de administrator altui membru.',
  targetNotMember: 'Această persoană nu face parte din grup.',
  cannotChangeOwnerRole:
    'Rolul administratorului nu se poate schimba aici. Transferă rolul de administrator altui membru.',
};
