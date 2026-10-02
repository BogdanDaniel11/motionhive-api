import type { Catalog } from '../..';

export const blog: Catalog['errors']['blog'] = {
  notFound: 'Nu am găsit articolul.',
  guestBylineAdminsOnly:
    'Doar administratorii platformei pot publica articole semnate de un autor invitat.',
  attributionAdminsOnly:
    'Doar administratorii platformei pot schimba autorul unui articol.',
  guestAuthorRequired:
    'Completează numele autorului invitat. Momentan nu poți reatribui articolul unui autor cu cont.',
  reloadFailed:
    'Am salvat articolul, dar nu l-am putut afișa. Reîncarcă pagina.',
  ownPostsOnly: 'Poți edita doar articolele tale.',
  invalidLanguage: 'Alege engleza sau româna ca limbă a articolului.',
};
