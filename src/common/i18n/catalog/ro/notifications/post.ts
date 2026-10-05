import type { Catalog } from '../..';

export const post: Catalog['notifications']['post'] = {
  pendingApproval: {
    title: 'O postare așteaptă aprobarea ta',
    body: '{name, select, null {O postare nouă} other {Postarea scrisă de {name}}}{group, select, null {} other { în „{group}”}} așteaptă aprobare. O găsești în grup.',
  },
  approved: {
    title: 'Postarea ta a fost aprobată',
    body: 'Postarea ta{group, select, null {} other { din „{group}”}} e acum vizibilă pentru tot grupul.',
  },
  rejected: {
    title: 'Postarea ta nu a fost aprobată',
    body: 'Un moderator a respins postarea ta{group, select, null {} other { din „{group}”}}, așa că a fost ștearsă.',
  },
  newComment: {
    title: 'Comentariu nou la postarea ta',
    body: '{name, select, null {Cineva} other {{name}}} a comentat la postarea ta{group, select, null {} other { din „{group}”}}.',
  },
};
