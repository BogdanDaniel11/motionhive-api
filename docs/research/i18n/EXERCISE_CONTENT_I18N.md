# Exercise content in Romanian: exercises, muscles, equipment, starter routines

Status: decision doc, nothing built. Written 2026-10-01.
Companion to `BACKEND_I18N_PLAN.md` (notifications and emails). That plan lists this content as out of scope; this doc covers it.

File references are `path:line` in `beeactive-api` unless they start with `beeactive-ui/`. Line numbers are from the working tree on the day of writing, which already contains the uncommitted backend i18n work (`src/common/i18n/`, migration 062).

## The decision in one paragraph

Add one nullable `translations JSONB` column to each table that holds system content (`exercise`, `muscle`, `equipment`, `program`, `program_workout`, `prescribed_exercise`), shaped `{"ro": {"name": "...", "instructions": "..."}}`. The existing English columns stay as the base text and the fallback. The API overlays the reader's language (from `user.language`) onto the existing response fields, so `name` simply arrives in Romanian and neither web nor already installed mobile builds need a change. Search runs on one generated, diacritic-free column that contains the English name and every translated name. Only system rows carry translations; anything a user owns (custom exercises, forks, copies of starters) stays single language. Exercise names follow the UI language, with the English name returned as `originalName` and always searchable. No separate "exercise name language" setting for now.

## 1. Current state (facts)

### What is stored, and which text a person sees

| Table | User visible text | Rows that are ours | Reference |
|---|---|---|---|
| `exercise` | `name`, `description` (NULL on seeded rows), `instructions` (steps joined with a blank line) | about 883 SYSTEM rows, `owner_id IS NULL` | `migrations/047_workouts_foundation.sql:198-252`, `scripts/seed-exercises.ts:231-232`, `scripts/seed-exercises.ts:340-364` |
| `muscle` | `common_name` (`latin_name` is Latin, `body_region` is not rendered) | 17 | `migrations/047_workouts_foundation.sql:136-166` |
| `equipment` | `name` | 15 | `migrations/047_workouts_foundation.sql:168-192` |
| `program` | `name`, `description`, `folder` ("MotionHive starters") | 10 starters, fixed UUIDs, `owner_id IS NULL`, `source = 'SYSTEM'` | `migrations/057_system_starter_routines.sql:169-230` |
| `program_workout` | `name` (same as the program name on starters), `notes` | 10 | `migrations/057_system_starter_routines.sql:235-247` |
| `prescribed_exercise` | `notes` (the coaching cue per exercise) | 42 | `migrations/057_system_starter_routines.sql:271-336` |

Everything else on these rows is an enum (`kind`, `level`, `movement_pattern`, `force`, `mechanic`) and is already translated on the frontend through `enum.*` keys (`beeactive-ui/projects/core/src/i18n/{en,ro}.json`, namespaces `exerciseKind`, `exerciseLevel`, `movementPattern`, `exerciseForce`, `exerciseMechanic`, `muscleRole`). There are no `enum.muscle` or `enum.equipment` keys: muscle and equipment labels come from the API as strings.

Slugs: `exercise.slug` is unique per owner, and system rows share the ownerless namespace (`migrations/047_workouts_foundation.sql:255-257`). `muscle.slug` and `equipment.slug` are globally unique. Slug plus `owner_id IS NULL` is the only key present on every system exercise (the 24 fallback rows created by `migrations/057_system_starter_routines.sql:74-116` have no `source_external_id`).

### How names travel through the system

- **Prescriptions and assignments reference the exercise by id, not by name.** `prescribed_exercise.exercise_id` (`migrations/047_workouts_foundation.sql:379-390`), `assigned_exercise.exercise_id` (`migrations/047_workouts_foundation.sql:506-521`), copied by id on assign (`src/modules/workout/program-assignment.service.ts:998`). Reads join the live exercise and select `name` (`src/modules/workout/program.service.ts:235-245`, `src/modules/workout/program-assignment.service.ts:345-365`). So a translated name shows up everywhere a plan is displayed, for each reader, with no data migration.
- **Logs snapshot the name as text.** `logged_exercise.exercise_name_snapshot` (`migrations/047_workouts_foundation.sql:631-646`), written from `exercise.name` at four sites (`src/modules/workout/workout-log.service.ts:208`, `:347`, `:603`, `:731`). `exercise_id` is kept next to it (nullable), and the log detail read also joins the live exercise (`src/modules/workout/workout-log.service.ts:1361-1373`). The frontend renders the snapshot, in about 20 places (`beeactive-ui/projects/core/src/lib/models/workout/log.model.ts:82`, `beeactive-ui/projects/mobile/src/app/main/workouts/logger/logger.html:43`).
- **Other text snapshots** are all user or coach authored text: `program_assignment.program_name_snapshot` (`src/modules/workout/program-assignment.service.ts:194`, `:498`), `assigned_workout.name` (`:516`, `:975`), `workout_log.name` (`src/modules/workout/workout-log.service.ts:334`).
- **Forks copy the text.** `fork()` clones `name`, `description`, `instructions` into a new private row owned by the instructor (`src/modules/exercise/exercise.service.ts:395-418`). One live fork per owner and source (`migrations/048_exercise_fork_unique_per_owner.sql:16-18`).
- **Copying a starter copies the text.** `duplicateForUser` writes `"<name> (my copy)"`, the description, folder, workout names and cue notes into rows the user owns, and references the same exercise ids (`src/modules/workout/program.service.ts:289-370`, suffix hardcoded in English at `:320`). A starter can also be started directly without a copy; then the log takes the program name and copies each cue into `logged_exercise.notes` (`src/modules/workout/workout-log.service.ts:274-352`).
- **`one_rep_max` and progress** reference `exercise_id` and read the live name, twice through Sequelize (`src/modules/progress/progress.service.ts:145-147`, `src/modules/workout/workout-log.service.ts:1098-1126`) and once in raw SQL (`src/modules/progress/progress.service.ts:671`).
- **Notifications** never carry a system exercise name today. `EXERCISE_FORKED` carries the name of an instructor owned exercise (`src/modules/exercise/notifications.ts:28-45`); workout notifications carry workout and program names, which are user text (`src/modules/workout/notifications.ts`).

### Search and sorting today

- Catalog search is `name ILIKE '%term%'` (`src/modules/exercise/exercise.service.ts:553-555`), backed by a trigram index on `name` (`migrations/047_workouts_foundation.sql:267`). The term is not passed through `escapeLikeWildcards`, which the project conventions require.
- Default sort is `ORDER BY name` (`src/modules/exercise/exercise.service.ts:599-616`).
- Exercises are written into `search_doc` (`src/modules/search/search-index.service.ts:368-430`), but global search never reads them: `SearchService._typesFor` only returns instructor, group, session, tag, user (`src/modules/search/search.service.ts:303-319`). The catalog endpoint is the only exercise search that exists.
- Starter and routine search is `program.name ILIKE` (`src/modules/workout/program.service.ts:133-138`).
- Nothing strips diacritics. A Romanian user who types "flotari" will not match "Flotări". This already affects custom exercises that coaches name in Romanian.

### Frontend

- Web and mobile read `exercise.name`, `muscle.commonName`, `equipment.name`, `instructions` straight from the API (`beeactive-ui/projects/web/src/app/main/instructor/exercises/exercise-card/exercise-card.ts:45-48`, `beeactive-ui/projects/web/src/app/main/instructor/exercises/exercise-filter-panel/exercise-filter-panel.html:42`, `beeactive-ui/projects/mobile/src/app/main/exercises/exercises.config.ts:325-345`). About 35 files read an exercise name.
- Mobile splits `instructions` into steps on blank lines (`beeactive-ui/projects/mobile/src/app/main/exercises/exercises.config.ts:383-398`), so a translation must keep the same blank line structure.
- Muscles and equipment are fetched once per page load (`beeactive-ui/projects/core/src/lib/stores/exercise-taxonomy.store.ts:45-63`). A language switch reloads the page (`beeactive-ui/projects/core/src/lib/services/i18n/language.service.ts:106-108`), so that cache resets itself.
- Mobile keeps the last 12 picked exercises in `localStorage`, full rows including the name (`beeactive-ui/projects/mobile/src/app/main/exercises/recent-exercises.store.ts`).
- Search and sort are server side on both apps (`beeactive-ui/projects/mobile/src/app/main/exercises/exercises.store.ts:215-224`), 100 rows per request at most.

### How the API can know the reader's language

`user.language` exists (`migrations/001_create_core_tables.sql:24`). `JwtStrategy.validate` loads the full user row on every request and spreads it into `req.user` (`src/modules/auth/strategies/jwt.strategy.ts:34-69`), so `req.user.language` is available at no extra cost. The backend i18n work in the tree already normalises the column (`migrations/062_notification_message_i18n.sql`), validates it on update, and provides `Locale`, `SUPPORTED_LOCALES` and `toLocale()` in `src/common/i18n/locale.ts`. Every exercise, program and log route is behind the JWT guard, so there is always a user. `PrincipalContext` does not carry the language yet (`src/common/decorators/principal.decorator.ts:13-18`).

## 2. What other apps do, and how Romanians name exercises

Short web check, not a study.

| App | What I could confirm |
|---|---|
| Gymkee (coach platform) | Every library exercise is translated into 5 languages; "names, descriptions, and muscles are automatically displayed in your client's language". Coach made exercises are single language. No separate name language setting. |
| TrueCoach (coach platform) | English only. Coaches abroad write their programs and exercises in their own language. |
| Trainerize | English first; no translated exercise library found. |
| Hevy | App localised in 12 languages. I could not confirm from their docs whether the exercise names are translated (help centre blocked the fetch). |
| JEFIT, Fitbod | App localised in 6 and 3 languages. Exercise name handling not documented. |
| Fitwill (has a Romanian site) | Exercise names fully translated ("Îndreptări românești cu haltera", "Flotări în plan înclinat"), English kept in the URL slug. |

None of the apps I could check offers a separate "exercise name language" setting. The pattern is: content follows the app language, and coach written content stays in whatever language the coach used.

Romanian gym vocabulary is mixed. World Class Romania writes its chest guide almost fully in Romanian ("Împins din culcat cu bara", "Flotări la paralele", "Fluturări cu gantere") and keeps "Pec-deck" and "Pullover". From general knowledge of Romanian gyms: the classic lifts have established Romanian names (genuflexiuni, flotări, tracțiuni, fandări, îndreptări, împins, ramat, flexii, extensii, fluturări), while newer names stay English (hip thrust, plank, burpee, face pull, kettlebell swing, farmer's walk, clean, snatch), and several are said both ways (deadlift and îndreptări, squat and genuflexiuni).

Consequence: a good Romanian catalog is not a word for word translation. It is a curated list in which many names stay English or become hybrids ("Hip thrust cu haltera", "Plank lateral"). That list is where the "many Romanians say it in English" concern gets solved, name by name, and it removes most of the need for a separate setting.

Sources: [Gymkee exercise library](https://gymkee.com/coach/fitness/exercise-library), [TrueCoach and international languages](https://help.truecoach.co/en/articles/2393524-truecoach-and-international-languages), [Fitbod languages](https://help.fitbod.me/hc/en-us/articles/26850917322519-Is-Fitbod-available-in-other-languages), [Hevy on the App Store](https://apps.apple.com/kr/app/hevy-%ED%97%AC%EC%8A%A4%EC%9D%BC%EC%A7%80-%EC%9A%B4%EB%8F%99%EA%B8%B0%EB%A1%9D-%ED%94%BC%ED%8A%B8%EB%8B%88%EC%8A%A4%EC%95%B1/id1458862350?l=en-GB), [Fitwill, Îndreptări românești cu haltera](https://fitwill.app/ro/exercise/2213/barbell-romanian-deadlift/), [World Class, exerciții piept](https://www.worldclass.ro/revista/exercitii-piept-recomandari-de-antrenamente-pentru-piept-la-sala).

## 3. Options

| | Option | Schema and Sequelize | Search and sort in both languages | Third language | User authored content, forks, copies | Verdict |
|---|---|---|---|---|---|---|
| A | Column per language (`name_ro`, `instructions_ro`, ...) | Simplest to read. About 11 new columns over 6 tables, 11 new entity fields. | Easy: plain columns, plain trigram index, `COALESCE(name_ro, name)`. | A migration that adds 11 columns again, plus entity edits, plus a change to every place that picks a column. Fine for 3 or 4 languages, ugly beyond. | Columns stay NULL. A "only system rows" rule has to list every column. | Works. This is the owner's idea and it is not wrong. It is the one that scales worst in number of languages. |
| **B** | **One `translations JSONB` per row** | 6 new columns, one shape, one entity field type. Text lives on the same row, so no extra joins. | Needs one helper so search does not care about JSON: a generated `search_name` column (section 4). Sort is one expression. | Content only: a new key inside the JSON and one entry in `SUPPORTED_LOCALES`. No DDL, no entity change. | Column stays NULL, enforced by one CHECK per table. | **Recommended.** Same idea as A, with one column instead of one per field per language. |
| C | Translation tables (`exercise_translation(exercise_id, locale, name, ...)`) | Textbook normalised. 6 new tables and entities, and a join at every read. The catalog list already joins owner, muscles and equipment (`src/modules/exercise/exercise.service.ts:636-653`); muscles and equipment would each need their own translation join inside it. About a dozen read sites select the exercise name through nested includes. | Good: one trigram index covers all languages. Sorting by translated name needs the join. | Rows only. Best of all options. | Clean (no rows). | Right when translations become user generated, need per translation metadata (status, reviewer), or pass roughly 8 languages. Too much plumbing for 2 languages and 900 curated rows. B converts to C with one `INSERT ... SELECT` if that day comes. |
| D | Keep the DB English, translate on the frontend by slug | No backend work. | Breaks: search and sort are server side and paged. Would need the whole catalog on the client. | JSON files only. | Fine. | Not viable for 883 exercises with instructions (several hundred KB per language in the app bundle, and no Romanian search). |
| E | Hybrid: D for muscles and equipment, A/B/C for the rest | Small saving (32 strings). | Fine. | Two places to maintain. | Fine. | Rejected. It is exactly the mix of approaches the owner wants to avoid, and a new equipment row would need a frontend release to get a label. |
| F | Translation files inside the API, keyed by slug, overlaid at read time | No migration. | Same problem as D: the database cannot search or sort text it does not hold. | Files only. | Fine. | Rejected for search and sort. |

One rule comes out of this and keeps the structure consistent:

> **Fixed values defined in code (enums) are translated on the frontend by key. Rows that live in the database are translated in the database and resolved by the API.**

Muscles and equipment are rows with ids, created by migrations, so they follow the second half of the rule, the same as exercises.

## 4. Recommendation: option B, resolved by the API

### 4.1 Rules

1. **English base columns stay** and are the fallback, per field. A row with a Romanian name and no Romanian instructions shows the Romanian name and the English instructions.
2. **Only system rows have translations.** `owner_id IS NULL` content is ours and bilingual. Content a person owns is single language, in whatever language they wrote it, and every reader sees it as written. This is how coach authored exercises coexist: nothing changes for them.
3. **References are localised when read; copies are written in the language of the person who copies.**
   - A plan, an assignment or a 1RM points at an exercise id. The name is resolved for whoever is reading. A coach reading in English and their client reading in Romanian each get their own language for the same plan.
   - A fork, a copy of a starter, a log started from a starter become the user's own text. They are written once, in that user's language at that moment, with `translations = NULL`. This also avoids a real bug: if a fork kept the Romanian translation and the coach then edited the English `name`, Romanian readers would keep seeing the old translated name.
4. **`translations` never leaves the API.** The reader gets one language.

### 4.2 Schema (DDL sketch)

Next free migration number (063 at the time of writing). Try it on a Neon branch first: it relies on the `unaccent` extension and on user defined functions inside a generated column.

```sql
BEGIN;

CREATE EXTENSION IF NOT EXISTS unaccent;

-- Lowercase and strip diacritics ("Flotări" becomes "flotari").
-- unaccent() is STABLE, so it is wrapped in an IMMUTABLE function to be
-- usable in a generated column and in an index (standard workaround).
CREATE OR REPLACE FUNCTION mh_fold(input text) RETURNS text
  LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT
  AS $$ SELECT lower(public.unaccent('public.unaccent'::regdictionary, input)) $$;

-- Every translation of one field, space separated: mh_i18n_text(t, 'name').
CREATE OR REPLACE FUNCTION mh_i18n_text(t jsonb, field text) RETURNS text
  LANGUAGE sql IMMUTABLE PARALLEL SAFE
  AS $$ SELECT coalesce(string_agg(l.value ->> field, ' '), '')
          FROM jsonb_each(coalesce(t, '{}'::jsonb)) AS l $$;

ALTER TABLE exercise            ADD COLUMN IF NOT EXISTS translations JSONB;
ALTER TABLE muscle              ADD COLUMN IF NOT EXISTS translations JSONB;
ALTER TABLE equipment           ADD COLUMN IF NOT EXISTS translations JSONB;
ALTER TABLE program             ADD COLUMN IF NOT EXISTS translations JSONB;
ALTER TABLE program_workout     ADD COLUMN IF NOT EXISTS translations JSONB;
ALTER TABLE prescribed_exercise ADD COLUMN IF NOT EXISTS translations JSONB;

-- Rule 2, enforced where the table knows who owns the row.
ALTER TABLE exercise ADD CONSTRAINT exercise_translations_system_only CHECK (
  translations IS NULL
  OR (source = 'SYSTEM' AND jsonb_typeof(translations) = 'object'));
ALTER TABLE program ADD CONSTRAINT program_translations_system_only CHECK (
  translations IS NULL
  OR (source = 'SYSTEM' AND jsonb_typeof(translations) = 'object'));

-- One searchable string per exercise: the base name plus every translated
-- name, folded. Postgres keeps it in sync by itself.
ALTER TABLE exercise ADD COLUMN IF NOT EXISTS search_name TEXT
  GENERATED ALWAYS AS (
    mh_fold(name || ' ' || mh_i18n_text(translations, 'name'))
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_exercise_search_name_trgm
  ON exercise USING gin (search_name gin_trgm_ops);

COMMIT;
```

Shape of the column. Keys inside a language are the API field names (camelCase), so the overlay is a direct key match:

```json
{ "ro": { "name": "Genuflexiuni cu haltera",
          "instructions": "Primul pas...\n\nAl doilea pas..." } }
```

| Table | Keys used |
|---|---|
| `exercise` | `name`, `description`, `instructions` |
| `muscle` | `commonName` |
| `equipment` | `name` |
| `program` | `name`, `description`, `folder` |
| `program_workout` | `name`, `notes` |
| `prescribed_exercise` | `notes` |

Entities get one field each: `declare translations: ContentTranslations | null`, with `type ContentTranslations = Partial<Record<Locale, Record<string, string>>>`. No DTO accepts `translations`, and the global `ValidationPipe` whitelist drops it, so users cannot write it.

Adding a third language later: add it to `SUPPORTED_LOCALES`, write the content, ship a content migration. No schema change, no query change.

### 4.3 API contract

**Request.** Nothing new. The language is `toLocale(req.user.language)`, the same source the notification work uses. No query parameter and no `Accept-Language`: one source of truth, and the frontend already keeps the account language in sync and reloads on a switch. Add `locale` to `PrincipalContext` so services that write copies have it.

**Response.** Same fields as today, in the reader's language, with per field fallback to English. One addition: when `name` was replaced, the object also carries `originalName` with the English name.

```jsonc
// GET /exercises/:id for a user whose language is "ro"
{
  "id": "…",
  "slug": "barbell-squat",
  "name": "Genuflexiuni cu haltera",
  "originalName": "Barbell Squat",
  "instructions": "Primul pas…\n\nAl doilea pas…",
  "muscleRoles": [{ "role": "PRIMARY", "muscle": { "slug": "quadriceps", "commonName": "Cvadricepși" } }],
  "equipment": [{ "slug": "barbell", "name": "Halteră" }]
}
```

The same user with language `en`, or any row without a translation, gets exactly today's response.

**Only the reader's language, not both.** Returning both would double the heaviest field (`instructions`) on lists of up to 100 rows for no benefit to the reader, and would force every frontend call site to choose. The English name is the single exception (`originalName`), because it is useful as secondary text.

**How it is applied: one place.** A global `ContentLocaleInterceptor`, same shape as the existing `CamelCaseInterceptor` (`src/common/interceptors/camel-case.interceptor.ts`, registered at `src/app.module.ts:130`), working on the plain camelCased output:

- For every object that has a `translations` key: for each field in `translations[locale]` that is also present on the object, replace the value (set `originalName` when the field is `name`), then delete `translations`. Fields that were not selected are never added.
- For a logged exercise: if the nested live `exercise` is a system row, `exerciseNameSnapshot` takes its (now localised) name. Otherwise the snapshot is shown as stored.
- Admin raw data routes opt out with a decorator.

The alternative is a `localize()` call in each of about a dozen service methods. One interceptor is less code and cannot be forgotten on a new endpoint. The cost is that each query must select `translations` where it uses an explicit attribute list. The sites to touch:

| Site | Change |
|---|---|
| `src/modules/workout/program.service.ts:235-245`, `src/modules/workout/program-assignment.service.ts:345-365`, `src/modules/workout/workout-log.service.ts:148-151`, `:311-314`, `:1361-1380`, `src/modules/progress/progress.service.ts:145-147` | add `'translations'` (and `'source'` on the log reads) to the exercise attribute list |
| `src/modules/workout/workout-log.service.ts:1098-1126` | builds `exerciseName` by hand: use a small `localized(row, 'name', locale)` helper |
| `src/modules/progress/progress.service.ts:671` | raw SQL: `COALESCE(e.translations -> :locale ->> 'name', e.name)` |
| `src/modules/exercise/exercise.service.ts:395-418` (fork) | copy the text resolved in the forker's language; leave `translations` NULL |
| `src/modules/workout/program.service.ts:317-370` (copy a starter) | same for program, workout names and cue notes; the "(my copy)" suffix becomes a catalog message through `translate()` from `src/common/i18n` |
| `src/modules/workout/workout-log.service.ts:334`, `:351` (start a starter directly) | log name and copied cue in the user's language |
| `src/modules/workout/workout-log.service.ts:208`, `:347`, `:603`, `:731` | write the snapshot in the user's language |

### 4.4 Search and sorting

**Search.** Replace the `name ILIKE` at `src/modules/exercise/exercise.service.ts:553-555` with one predicate on the generated column:

```sql
WHERE search_name LIKE mh_fold('%' || :escapedTerm || '%')
```

One predicate, one index, any number of languages. A Romanian reader finds "Genuflexiuni cu haltera" by typing "genuflexiuni", "genuflex", "squat" or "barbell squat"; an English reader can still type "squat". "flotari" matches "Flotări", including custom exercises that coaches named in Romanian. The term goes through `escapeLikeWildcards`, which closes the gap noted in section 1. If aliases are ever wanted ("RDL", "OHP"), they are one more term inside the same generated expression, as the workouts research already planned (`docs/research/workouts/04-locked-decisions.md:278`).

Starters: `program.service.ts:133-138` gets `OR translations -> :locale ->> 'name' ILIKE :term`. Ten rows, no index needed.

Global search (`search_doc`) needs nothing now because it does not return exercises. If exercises are added to it later, index `search_name` into `search_text` and let the interceptor resolve the title.

**Sorting.** Order by the name the reader sees, folded so that Romanian letters sort where people expect:

```sql
ORDER BY mh_fold(COALESCE(translations -> :locale ->> 'name', name)), id
```

Without the fold, "Împins din culcat" and "Îndreptări" (bench press and deadlift) can land after Z depending on the database collation. The catalog has no btree index on `name` today either, so this sort costs the same as the current one.

### 4.5 Historical logs

- Old logs hold the English name in the snapshot and still point at the exercise. A Romanian reader sees the Romanian name, an English reader sees the English one, because the live system exercise wins over the snapshot at read time. No backfill.
- If someone switches language, their history switches with it. This matches the notification plan, where old notifications are rendered in the new language too.
- The snapshot keeps its original job as the fallback when the exercise is gone, and for coach authored exercises it stays the source (a later rename by the coach does not rewrite history, as today).
- New snapshots are written in the user's language so that responses which return a new logged exercise without the joined row (`src/modules/workout/workout-log.service.ts:597-620`) already read correctly.

### 4.6 Frontend changes

Required: none for the content to appear in Romanian, on web, on mobile, and on mobile builds already in the stores.

Worth doing, small:

1. Add `originalName?: string | null` to the `Exercise` model in `core` and show it as muted secondary text on the exercise detail (web dialog, mobile detail page). Whether list rows show it too is an open decision.
2. Put the language in the storage key of `RecentExercisesStore` so the 12 cached rows do not show the previous language after a switch.
3. Nothing for muscles and equipment: `ExerciseTaxonomyStore` reloads with the page. Do not add `enum.muscle` or `enum.equipment` keys.
4. The exercise form stays single language. A coach writes in one language.

### 4.7 Caching and payload

- No server cache exists for the catalog today. If one is added, cache raw rows and let the interceptor localise per request, so the cache is not keyed by language.
- Responses are per user behind `Authorization`, so there is no shared HTTP cache to worry about.
- Payload does not grow, apart from `originalName` (about 25 bytes per translated row).
- Database to API: the row carries all languages of its text. At two languages this is one extra copy of the instructions per row, a few tens of KB on a page of 100. Acceptable. If it ever matters, select `translations -> :locale` instead of the whole column.

## 5. Producing and maintaining the translations

The schema is the small part. The content is the real job: 883 names, 883 instruction texts (my estimate is 500 to 900 KB of English), 32 lookup labels, 10 starters with 42 cues.

Same pattern the repo already uses for the blog (`migrations/054_blog_content_rewrite.sql`, generated by a script from reviewed source files, matched on slug and language, corrections shipped as a new generated migration).

1. **Source files in git.** `docs/content/exercises/en.json` is an export of the system rows from production (`slug`, `name`, `instructions`), not from the upstream dataset, because the database is what users see. `ro.json` has the same slugs with `name` and `instructions`. Small hand written files for muscles, equipment and starters.
2. **Glossary first.** One page, about 60 decisions: each movement word (squat, deadlift, press, row, curl, raise, fly, lunge, pulldown, push-up, pull-up, dip, crunch, plank, thrust) and each equipment word (barbell, dumbbell, cable, machine, bands, bench) gets its Romanian form or an explicit "keep English". The owner signs it off. Every later step obeys it. This is where the tone of the Romanian catalog is decided.
3. **Names.** Machine draft constrained by the glossary, then human review in a spreadsheet sorted by movement family so inconsistencies are visible side by side. Names are short; 883 rows is an afternoon or two. The 24 exercises used by the starters and the most common lifts get the closest read.
4. **Instructions.** Machine draft following the Romanian rules already written down for the product (`motionhive-review` section 5: "tu" register, comma below ș and ț, no calques). Automatic checks before any human reads it: same number of steps as the English text, same blank line structure, no cedilla ş or ţ, glossary terms used consistently, length within a sane ratio. Then a human reads all instructions for the starter exercises and a sample of the rest.
5. **Build.** `scripts/build-exercise-translations-migration.mjs` reads the JSON and writes the migration: `UPDATE exercise SET translations = jsonb_set(coalesce(translations, '{}'), '{ro}', '<json>') WHERE slug = '<slug>' AND owner_id IS NULL AND source = 'SYSTEM'`. Muscles and equipment match on `slug`, starters on their fixed ids. Idempotent. It ends with a notice listing slugs that matched no row. Expect roughly 60 KB for names and under 1 MB for instructions; split into two files.
6. **Staying correct.** `scripts/seed-exercises.ts` overwrites the English `name` and `instructions` when it is re-run (`scripts/seed-exercises.ts:290-313`) and does not touch `translations`, so a Romanian text can go stale silently. Add a check script that compares the English in the database with `en.json` and lists the slugs that drifted. Run it after any re-seed.
7. **Missing translation.** Per field fallback to English, by design. Nothing breaks if only names are done.

## 6. Rollout

| Phase | Scope | Visible result |
|---|---|---|
| 0 | Already in progress with the notification work: `user.language` validated and sent at signup | none |
| 1 | Schema migration, entity fields, `locale` on `PrincipalContext`, interceptor, search and sort change, copy rules for fork and starter copy, tests (one translated fixture row, every endpoint that returns an exercise read as `ro` and as `en`) | diacritic free search; otherwise identical, because no translations exist yet |
| 2 | Muscles, equipment, the 10 starters and their 42 cues in Romanian | filters, chips and the starter library in Romanian |
| 3 | Glossary, then the 883 exercise names; `originalName` shown on the detail screens | the catalog, plans and history in Romanian |
| 4 | Instructions | full Romanian detail pages |
| Later, only if asked for | Aliases in search; a separate exercise name language setting; exercises in global search | |

Each phase ships alone. Phase 1 is safe to deploy early because an empty `translations` column changes nothing.

## 7. Risks

1. **Content quality and drift, not schema.** Stiff or inconsistent Romanian names are worse than English ones for the audience that says "deadlift". The glossary and the family by family review are the control. Stale Romanian after an English change is the long term version of the same risk; the check script covers it.
2. **A read path that forgets to select `translations`** shows English with no error. The phase 1 test list is the control.
3. **The interceptor is implicit behaviour.** It mirrors an existing global interceptor and is one small pure function, but it must be documented in `CLAUDE.md` next to `CamelCaseInterceptor`.
4. **`unaccent` and generated columns with custom functions** are standard Postgres but untested here. Verify on a Neon branch before writing the real migration. Fallback if `unaccent` is unavailable: `translate(lower(x), 'ăâîșțşţ', 'aaistst')` inside `mh_fold`, which covers Romanian.

## 8. Open decisions for the owner

1. **The glossary.** Which names become Romanian, which stay English, which are hybrids (deadlift or îndreptări, squat or genuflexiuni, hip thrust, plank). This is the decision that matters most and only a native speaker who trains can make it.
2. **A separate "exercise names in English" setting.** Recommendation: not now. No app checked has one, the glossary already keeps English where Romanians use English, and the English name is shown and searchable. If users ask, it is one nullable column (`user.exercise_language`) read by the same resolver, and a toggle in settings. Nothing in this design blocks it.
3. **Where the English name is shown.** Recommendation: detail screens only. Alternative: also as a second line in catalog and picker rows.
4. **Names before instructions.** Recommendation: yes, ship phase 3 without waiting for phase 4.
5. **Existing forks and starter copies** made before the translations exist stay in English, because they are the user's rows. Recommendation: leave them. A one time backfill is possible for rows whose text is still identical to the English source.
6. **Who reviews.** Names need one native reviewer. Instructions need a decision on how much human review is enough beyond the starter exercises.

## 9. Side findings (not part of the decision)

- `src/modules/exercise/exercise.service.ts:553-555` builds the `ILIKE` pattern without `escapeLikeWildcards`.
- Exercises are indexed into `search_doc` but no search reads them (`src/modules/search/search.service.ts:303-319`).
- `GET /exercises` returns full rows, `instructions` included, for up to 100 rows per page (`src/modules/exercise/exercise.service.ts:136-144`). The mobile list does not need it.
- The fallback exercises inserted by migration 057 have no `source_provider` or `source_external_id`. `seed-exercises.ts` looks rows up by those two columns (`scripts/seed-exercises.ts:276-283`) and otherwise inserts by slug, so on a database where 057 ran before the seed, those 24 slugs look likely to hit the unique slug index instead of being enriched as the migration comment expects. Worth checking on production before exporting `en.json`.
- Hardcoded English written into user rows: `"(my copy)"` (`src/modules/workout/program.service.ts:320`) and the `'Exercise'` fallback name (`src/modules/workout/workout-log.service.ts:208`, `:347`, `:1125`).
