import type { Catalog } from '../..';

export const payment: Catalog['notifications']['payment'] = {
  invoiceCreated: {
    title: 'Factură nouă',
    body: '{due, select, null {{amount}. Deschide factura pentru detalii.} other {{amount}, cu scadența pe {due}.}}',
  },
  invoicePaidForInstructor: {
    title: 'Factură plătită',
    body: 'Clientul tău a plătit factura {ref}.',
  },
  invoicePaidForClient: {
    title: 'Plată confirmată',
    body: 'Mulțumim! Plata ta a fost procesată.',
  },
  invoiceMarkedPaid: {
    title: 'Factură marcată ca plătită',
    body: 'Factura {ref} a fost marcată ca plătită în afara platformei.',
  },
  invoicePaymentFailed: {
    title: 'Plată eșuată',
    body: 'Plata facturii nu a reușit. Actualizează cardul și încearcă din nou.',
  },
  invoiceDueSoon: {
    title: 'Ai o factură de plătit în curând',
    body: '{due, select, null {Ai de plătit {amount} în curând.} other {Ai de plătit {amount} până pe {due}.}}',
  },
  invoiceOverdueForClient: {
    title: 'Factură restantă',
    body: 'Ai o restanță de {amount}. Plătește ca să nu-ți fie întrerupt accesul.',
  },
  invoiceOverdueForInstructor: {
    title: 'Un client are o factură restantă',
    body: 'Factura {ref} ({amount}) a depășit scadența.',
  },
  invoiceDunning: {
    title: 'Plată eșuată: actualizează cardul',
    body: 'Factura ta e încă neplătită după o plată eșuată. Actualizează cardul și încearcă din nou ca să-ți păstrezi accesul.',
  },
  subscriptionCreated: {
    title: 'Abonament nou',
    body: 'Ți-a fost creat un abonament: „{product}”. Găsești detaliile în profilul tău.',
  },
  subscriptionCancelled: {
    title: 'Abonament anulat',
    body: '{product, select, null {Abonamentul tău a fost anulat.} other {Abonamentul tău „{product}” a fost anulat.}}',
  },
  subscriptionWillCancel: {
    title: 'Abonamentul tău se va încheia',
    body: '{product, select, null {Abonamentul tău se va încheia la finalul perioadei curente.} other {Abonamentul tău „{product}” se va încheia la finalul perioadei curente.}}',
  },
  subscriptionCancelledByClient: {
    title: 'Un client și-a anulat abonamentul',
    body: '{name, select, null {Un client} other {{name}}} și-a anulat abonamentul{product, select, null {} other { „{product}”}}. Accesul se încheie la finalul perioadei.',
  },
  refundIssued: {
    title: 'Rambursare inițiată',
    body: 'A fost inițiată o rambursare de {amount}.',
  },
  refundWindowClosing: {
    title: 'Perioada de rambursare se încheie',
    body: 'Plata de {amount} mai poate fi rambursată {days, plural, one {doar până mâine} few {doar în următoarele # zile} other {doar în următoarele # de zile}}.',
  },
  cardExpiring: {
    title: 'Cardul tău expiră în curând',
    body: 'Cardul tău{last4, select, null {} other { cu terminația {last4}}} expiră în {expiry}. Actualizează-l ca să eviți o plată eșuată.',
  },
  earningsSummary: {
    title: 'Câștigurile tale din {month}',
    body: '{amount} {count, plural, one {dintr-o plată} few {din # plăți} other {din # de plăți}} în {month}.',
  },
  disputeOpened: {
    title: 'Plată contestată',
    body: 'O plată de {amount} a fost contestată la bancă{reason, select, fraudulent { (raportată ca fraudă)} duplicate { (plată dublă)} product_not_received { (serviciu neprimit)} product_unacceptable { (serviciu necorespunzător)} subscription_canceled { (abonament anulat)} credit_not_processed { (rambursare neprimită)} unrecognized { (plată nerecunoscută)} other {}}. {due, select, null {Răspunde în Stripe cât mai repede.} other {Trimite dovezile în Stripe până pe {due}.}}',
  },
  stripeAccountReady: {
    title: 'Plățile sunt active',
    body: 'Contul tău Stripe a fost verificat. De acum poți emite facturi și primi plăți de la clienți.',
  },
  stripeAccountRestricted: {
    title: 'Contul tău Stripe are nevoie de atenție',
    body: 'Stripe cere informații suplimentare ca să-ți păstreze active transferurile către contul bancar. Deschide panoul Stripe ca să le completezi.',
  },
  stripeAccountDisconnected: {
    title: 'Cont Stripe deconectat',
    body: 'Contul tău Stripe a fost deconectat. Îl poți reconecta din pagina de plăți.{count, plural, =0 {} one { Abonamentul activ al unui client se încheie la finalul perioadei de facturare curente, fără alte încasări.} few { # abonamente active ale clienților tăi se încheie la finalul perioadei de facturare curente, fără alte încasări.} other { # de abonamente active ale clienților tăi se încheie la finalul perioadei de facturare curente, fără alte încasări.}}',
  },
  disputeEvidenceDue: {
    title: 'Termenul pentru dovezi se apropie',
    body: '{due, select, null {Dovezile pentru o plată contestată trebuie trimise {days, plural, one {până mâine} few {în cel mult # zile} other {în cel mult # de zile}}.} other {Dovezile pentru o plată contestată trebuie trimise până pe {due} ({days, plural, one {mâine} few {peste # zile} other {peste # de zile}}).}} Trimite-le din Stripe.',
  },
};
