import type { Catalog } from '../..';

export const user: Catalog['errors']['user'] = {
  notFound: 'Nu am găsit utilizatorul.',
  emailTaken: 'Există deja un cont cu această adresă de email.',
  verifyBeforeLinking:
    'Există deja un cont cu această adresă de email. Autentifică-te cu parola și verifică-ți adresa de email înainte să conectezi un cont de Google sau Facebook.',
  countryLocked:
    'Nu poți schimba țara după ce ai configurat plățile. Scrie-ne și mutăm noi contul tău Stripe.',
};
