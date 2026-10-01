# Backend i18n: notifications + emails in Romanian

Status (2026-10-01): **done.** Notifications (phase 2) and every transactional email (phase 3)
render in the reader's language, English or Romanian. The Romanian was checked by blind
back-translation and fixed; the owner's review sheet is
`motionhive-ro-notifications-review.xlsx` (tabs Notifications, Emails, Email frame). See "As built"
below; where it differs from the original "Design" section, "As built" wins.

## As built

```
src/common/i18n/
├── locale.ts        Locale ('en' | 'ro'), DEFAULT_LOCALE, toLocale(), INTL_LOCALE
├── params.ts        money() / day() / dayTime() tagged values + per-locale formatting
├── translate.ts     translate(locale, key, params), isMessageKey()
├── catalog/
│   ├── index.ts     Catalog type (= shape of English), MessageKey, CATALOG
│   ├── en/          email.ts, notifications/<module>.ts   ← source of truth
│   └── ro/          same files, typed `Catalog[...]`
└── *.spec.ts        ICU validity + same params in every language
```

- **Catalogs are TypeScript, not JSON.** English defines the `Catalog` type; `ro` is typed
  against it, so a missing or extra key is a compile error, and `translate()` only accepts
  keys that exist. No runtime "missing translation" path, no asset copying into `dist/`.
- **Pure functions, no Nest module.** `translate()` is imported wherever text is produced
  (services, workers, email templates). Engine: `@messageformat/core`, same as the frontend.
- **Money and dates are tagged raw values** (`money(cents, currency)`, `day(date)`,
  `dayTime(date, tz)`), formatted per reader at render time. Plain JSON, so they survive the
  JSONB round trip.
- **Notifications** (migration 062): `notification.message_key` + `message_params`. A builder
  returns `message: { key: 'client.requestReceived', params: { name } }`, never finished
  text. The row still stores the English rendering in `title` / `body` as the
  fallback. Text is rendered per reader: on `GET /notifications` (from `req.user.language`) and
  per recipient for email and push. The frontend is unchanged.
- **One email, one language.** A notification without a key (legacy row, or a builder not
  converted yet) is emailed in an English layout even to a Romanian reader, instead of English
  text inside Romanian chrome.
- **Email layout** (`base-layout.ts`): `baseLayout`, `plainTextLayout` and `eyebrow` take a
  `locale` (default `en`); footer links point at `/ro/legal/...` for Romanian.
- **`user.language`**: validated (`@IsIn(SUPPORTED_LOCALES)`), accepted on register and
  Google/Facebook sign-in (applied only when the account is created), and the frontend sends
  the app language on those calls. **Deploy the API before the frontend**: the API rejects
  unknown body fields (`forbidNonWhitelisted`), so a new frontend against an old API fails
  signup.
- **Stripe**: `preferred_locales` is set right after a customer is created and re-synced by
  the `payments.sync_customer_locale` job when a user switches language. It drives Stripe's
  own invoice emails, hosted invoice page and billing portal. Best effort: a failure is
  logged, never thrown.

### Adding a notification

1. Add `{ title, body, cta? }` under `<name>` in `catalog/en/notifications/<module>.ts`.
2. Add the Romanian under the same key in `catalog/ro/notifications/<module>.ts` (the build
   fails until you do). Write it natively, per the `motionhive-review` skill §5; do not
   translate word for word.
3. In `<module>/notifications.ts`, return `message: { key: '<module>.<name>', params }` with
   raw values: `money()`, `day()`, `dayTime()`, `month()`, plain counts for plurals, and
   `null` for anything that can be missing (the message words that case itself with
   `{x, select, null {…} other {…}}`). Never pre-format, never escape HTML, never glue
   fragments.
4. Add a sample (plus one per missing-value / plural case) to
   `test/fixtures/notification-samples.ts`. `notification-builders.spec.ts` then checks it
   in every language: all values passed, no leftover braces, whole sentences.

`title` + `body` raw text still exists on `notify()` for one caller only: the debug endpoint,
which sends whatever an operator types. `notification/format.ts` is gone; the one direct
email that formatted money with it now calls `formatMoney(..., DEFAULT_LOCALE)`.

Dates: English keeps the compact form (`Mon 15 Jun, 21:00`); Romanian spells weekday and
month out (`luni, 15 iunie la 21:00`), because its abbreviations carry full stops that read
as broken punctuation inside a sentence.

### Emails

- Copy lives in `catalog/{en,ro}/email/<domain>.ts`, one node per template:
  `email.<domain>.<template>.<part>` (`subject`, `preheader`, `heading`, `body`, `cta`, …).
  `layout.ts` is the frame every email shares.
- Templates read copy through `emailCopy(locale, 'email.<domain>.<template>')`
  (`src/common/email/_layouts/copy.ts`): `c.html(part, params)` escapes the whole rendered
  sentence, values included, and turns `**bold**` into `<strong>`; `c.text(part, params)` is the
  plain-text version. So templates pass raw values and never put HTML in the catalog.
- Every template and every `EmailService.sendXxx` takes a `locale`. Subjects come from the
  catalog (`translate(locale, 'email.<domain>.<template>.subject', params)`).
- Which language: the recipient's `user.language`; for someone without an account (client and
  group invites, friend invites, coach suggestions, an invoice sent to another address) the
  sender's; for the public waitlist and feedback forms the `language` the page sends.
- Every email has samples in `test/fixtures/email-samples.ts`. `email-templates.spec.ts` renders
  each in every language (whole sentences, no leftover ICU, no markup in the text part,
  Romanian typography, escaping of hostile values), and `scripts/send-email-previews.ts` sends
  the same samples to a real inbox (`--locale en|ro|both`, `--only <name>`).
- Removed: the session cancelled / rescheduled / reminder / participant-status emails, which
  nothing called (the notification emails cover those events).

### Decisions taken (were open)

1. In-app text is rendered by the API at read time.
2. Invites to people without an account will use the sender's language (phase 3).
3. Existing accounts keep their stored language; people switch in the app.

## Where we are

The web and mobile apps are fully bilingual (ngx-translate, ICU MessageFormat, `en` / `ro`).
Everything the **backend** writes is English only:

- **Notifications** (49 types, 53 builders in `src/modules/*/notifications.ts`) store rendered
  English `title` / `body` on the `notification` row. The FE shows them verbatim (web bell,
  mobile banner, list row, detail sheet). One row is shared by every recipient of
  `notifyMany`, so a per-recipient language cannot live in the stored text.
- **Notification emails** reuse the same English title (as subject) and body
  (`notification.service.ts` `deliverToUser` → `notifications.email_send` →
  `genericNotificationTemplate`). Push will reuse them too.
- **Direct emails** (~30 templates in `src/common/email/`, ~30 `sendXxx()` methods in
  `EmailService`): auth (verify, reset, welcome, password changed), client invites and
  requests, group invites, invoices, subscription setup, waitlist, feedback. Subjects are
  hardcoded English; `base-layout.ts` has English shared copy (`<html lang="en">`, category
  labels, footer links, "All rights reserved.", "See details in the app").
- **Formatters** (`notification/format.ts`) hardcode `en-GB` and print money as `12.34 EUR`.
- **Stripe** gets no `preferred_locales` / `locale`, so Stripe's own invoice emails, hosted
  invoice page and checkout render in English (or the browser's guess).
- **`user.language`** exists (`VARCHAR(5) NOT NULL DEFAULT 'en'`) but nothing on the API reads
  it, the DTO accepts any 5-char string, and signup never sends it, so almost every row is the
  default `'en'` whatever the person actually uses.

## Rules we already have (apply them here, don't reinvent)

From `beeactive-ui/CLAUDE.md` (i18n section), `motionhive/integration.md`, and the
`motionhive-review` skill §5:

- **ICU MessageFormat**, same syntax as the FE. Romanian plurals use `one` / `few` / `other`
  with `de` in `other` (`{count, plural, one {# sesiune} few {# sesiuni} other {# de sesiuni}}`).
- **One key per full sentence, with params.** Never build sentences by concatenation.
- **BE returns raw values** (cents + currency, ISO dates, enums); formatting happens in the
  reader's locale (`en` → `en-GB`, `ro` → `ro-RO`).
- **Romanian is native, not literal**: "tu" register, comma-below ș/ț, canonical terms
  (Sesiuni, Programe, Plăți, Mesaje…), no calques, no dashes in new copy.
- **Key parity**: en and ro catalogs have identical keys, enforced by a check.
- The jobs-system research (`docs/research/jobs-system/04`, `10`) already assumed a
  `locale` dimension on notification templates. This plan is that layer.

## Design

### 1. One catalog, owned by the API

`src/i18n/{en,ro}/notifications.json` and `src/i18n/{en,ro}/emails.json`, ICU strings, nested
camelCase keys like the FE. An `I18nService` (global module) loads them at boot and exposes
`t(locale, key, params)` using `@messageformat/core`, the same engine the FE uses, so a string
behaves identically on both sides. Unknown locale → `en`; missing key → `en` value + warn log.

A Jest test enforces: identical key sets across locales, every `NotificationType` has
`notifications.<type>.title` and `.body`, and every string compiles.

### 2. Notifications: store key + params, render when read

- Migration: add `notification.params JSONB NULL`.
- Builders return `{ type, params, data }` with **raw primitives** in `params`
  (names, cents, currency, ISO timestamps, time zone). They already take primitives (CLAUDE.md
  rule), so this is a mechanical change per builder. Keep writing `title` / `body` rendered in
  `en` as a fallback for old app versions and for search/logs.
- **Render on read**: the list / unread endpoints render `title` / `body` from `type + params`
  in the **requesting user's** language. The FE does not change at all. A user who switches
  language sees their old notifications in the new language too.
- Legacy rows (`params IS NULL`) keep showing their stored English text.
- **Email and push** render at delivery time (`deliverToUser` is already per recipient), with
  the recipient's language: subject from `title`, body from `body`, plus a translated CTA.
- `format.ts` becomes locale-aware: `formatMoney(cents, currency, locale)` via
  `Intl.NumberFormat`, dates via `Intl.DateTimeFormat` with `ro-RO` / `en-GB` and the
  session time zone.

Why not render on the FE from `type + params`? It would duplicate the catalog (FE for in-app,
BE for email/push), and the two would drift. One catalog on the API covers in-app, email and
push.

### 3. Emails: templates take a translator

- Every `sendXxx()` takes the recipient's locale (or resolves it from the user id) and passes a
  `t` bound to that locale into the template. Subjects move into the catalog.
- `base-layout.ts`: `<html lang>` from locale, category labels, footer, "All rights reserved",
  "See details in the app", plain-text layout all go through `t`. `COMPANY` legal data stays
  as is (it is the same in both languages; see memory `project_legal_identity_two_copies`).
- Footer links point at the RO legal pages (`/ro/...`) when the locale is `ro`.
- **Recipient without an account** (client invites, group invites, social invites): use the
  **sender's** language. Waitlist / feedback: use the language of the page that submitted it
  (add an optional `language` field to those DTOs).
- Delete the dead methods first (`sendSessionCancelledEmail`, `sendParticipantStatusEmail`,
  `sendSessionRescheduledEmail`, `sessionReminderTemplate`; confirm no callers), so we don't
  translate code nobody runs.

### 4. Make `user.language` trustworthy (prerequisite)

- `UpdateUserDto.language`: `@IsIn(['en', 'ro'])`.
- Register + OAuth signup accept `language`; the FE sends the device language
  (`appLanguage()`), so new accounts start correct.
- Existing users stay `'en'` until they switch. Acceptable: the switch in the profile menu
  already PATCHes the account, and the FE re-syncs on sign-in. (Optional later: treat `'en'`
  plus a Romanian `Accept-Language` on sign-in as a hint, but only if we see it matter.)

### 5. Stripe

- `customers.create` / update: `preferred_locales: [user.language]`; update it when the user
  changes language (`UserService.updateUser`).
- Checkout and billing-portal sessions: `locale: user.language`.
- This makes Stripe's own invoice emails and hosted pages Romanian. No copy for us to write.

## Phases

| Phase | Scope | Size |
|---|---|---|
| 0 | `user.language` validation, signup/OAuth sends language, Stripe `preferred_locales` + `locale` | small |
| 1 | `I18nService`, catalog files, parity/compile test, locale-aware `format.ts` | small |
| 2 | `notification.params` migration; convert builders module by module (payment 18, group 11, session 10, client 5, post 4, workout 3, messaging 1, exercise 1); render on read + on email/push delivery | medium |
| 3 | Email layout + ~30 templates + subjects; recipient-locale resolution; delete dead methods | medium |
| 4 | Romanian copy pass: write RO with the `motionhive-review` §5 rules, then run the skill over both catalogs; send a test email of each template in RO and read it | small |

Each phase ships on its own. Phase 2 is safe to roll out module by module because of the
English fallback.

## Not in scope

- Exercise catalog, muscle / equipment names, the 10 starter routines (DB content; separate
  plan: RO columns or FE keys matched by slug).
- Backend error messages shown raw in toasts (`err.error.message`); separate, smaller fix
  (return error codes, translate on the FE).
- More languages. The design supports them; nothing else changes.
