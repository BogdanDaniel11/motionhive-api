#!/usr/bin/env node
/**
 * build-content-translations.mjs
 *
 * Turns the reviewed translation files in docs/content/translations/ into a
 * migration that fills the `translations` column (migration 063) on
 * MotionHive's own rows: the exercise library, muscles, equipment and the
 * starter routines.
 *
 * Source files (the source of truth, reviewed in git):
 *   en-source.json        the English each translation was made from:
 *                         { exercises: { <slug>: { name, instructions } } }
 *   <lang>/exercises.json { <slug>: { name, instructions? } }
 *   <lang>/muscles.json   { <slug>: { commonName } }
 *   <lang>/equipment.json { <slug>: { name } }
 *   <lang>/starters.json  { programs: { <id>: { name, description, folder } },
 *                           workouts: { <id>: { name, notes? } },
 *                           cues:     { <id>: { notes } } }
 *
 * Before writing anything it checks every text and stops on the first
 * failure: no dash used as punctuation, no cedilla ş/ţ (Romanian takes the
 * comma below), no empty text, instructions with as many steps as the
 * English (the mobile app splits them on blank lines), and only slugs that
 * exist in en-source.json.
 *
 * Rows are matched on slug (exercises: ownerless SYSTEM rows only, so a
 * coach's exercise with the same slug is never touched) or on the fixed ids
 * of the starters. The migration is idempotent, reports slugs that matched
 * nothing, and reports exercises whose English changed since translation,
 * so stale Romanian is visible when it runs.
 *
 * Usage: node scripts/build-content-translations.mjs [--lang ro] [--check] [--number NNN]
 *   --check   validate only, write nothing
 *   --number  migration number (default 065; a later correction takes the next free one)
 * Output: migrations/065_content_translations_<lang>.sql
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_DIR = join(ROOT, 'docs', 'content', 'translations');

const args = process.argv.slice(2);
const LANG = args.includes('--lang') ? args[args.indexOf('--lang') + 1] : 'ro';
const CHECK_ONLY = args.includes('--check');
// 065 is the first run. A correction after it has shipped is a NEW migration:
// pass the next free number, e.g. --number 071.
const NUMBER = args.includes('--number') ? args[args.indexOf('--number') + 1] : '065';
const MIGRATION = `migrations/${NUMBER}_content_translations_${LANG}.sql`;

const read = (file) => JSON.parse(readFileSync(join(SOURCE_DIR, file), 'utf8'));

const en = read('en-source.json');
const exercises = read(`${LANG}/exercises.json`);
const muscles = read(`${LANG}/muscles.json`);
const equipment = read(`${LANG}/equipment.json`);
const starters = read(`${LANG}/starters.json`);

// ── Checks ────────────────────────────────────────────────────────────

const problems = [];
const DASH = /[–—]| - /;
const CEDILLA = /[ŞşŢţ]/;
const steps = (text) => text.split(/\n\s*\n/).filter((s) => s.trim()).length;

function checkText(where, text) {
  if (typeof text !== 'string' || !text.trim()) {
    problems.push(`${where}: empty`);
    return;
  }
  if (DASH.test(text)) problems.push(`${where}: dash used as punctuation`);
  if (CEDILLA.test(text)) problems.push(`${where}: cedilla ş/ţ, use ș/ț`);
  if (text !== text.trim()) problems.push(`${where}: leading or trailing space`);
}

function checkFields(where, fields, allowed) {
  for (const [field, text] of Object.entries(fields)) {
    if (!allowed.includes(field)) problems.push(`${where}: unknown field ${field}`);
    checkText(`${where}.${field}`, text);
  }
}

for (const [slug, fields] of Object.entries(exercises)) {
  const source = en.exercises[slug];
  if (!source) {
    problems.push(`exercise ${slug}: not in en-source.json`);
    continue;
  }
  checkFields(`exercise ${slug}`, fields, ['name', 'description', 'instructions']);
  if (fields.instructions && source.instructions) {
    const want = steps(source.instructions);
    const got = steps(fields.instructions);
    if (want !== got) {
      problems.push(`exercise ${slug}: ${got} steps, the English has ${want}`);
    }
  }
}
for (const [slug, fields] of Object.entries(muscles)) {
  checkFields(`muscle ${slug}`, fields, ['commonName']);
}
for (const [slug, fields] of Object.entries(equipment)) {
  checkFields(`equipment ${slug}`, fields, ['name']);
}
for (const [id, fields] of Object.entries(starters.programs)) {
  checkFields(`program ${id}`, fields, ['name', 'description', 'folder']);
}
for (const [id, fields] of Object.entries(starters.workouts)) {
  checkFields(`workout ${id}`, fields, ['name', 'notes']);
}
for (const [id, fields] of Object.entries(starters.cues)) {
  checkFields(`cue ${id}`, fields, ['notes']);
}

if (problems.length) {
  console.error(`${problems.length} problem(s):\n  ${problems.join('\n  ')}`);
  process.exit(1);
}

const untranslated = Object.keys(en.exercises).filter((slug) => !exercises[slug]);
console.log(
  `OK: ${Object.keys(exercises).length} exercises (${untranslated.length} without a translation), ` +
    `${Object.keys(muscles).length} muscles, ${Object.keys(equipment).length} equipment, ` +
    `${Object.keys(starters.programs).length} starters, ${Object.keys(starters.cues).length} cues`,
);
if (CHECK_ONLY) process.exit(0);

// ── SQL ───────────────────────────────────────────────────────────────

const str = (s) => `'${String(s).replace(/'/g, "''")}'`;
const json = (o) => `${str(JSON.stringify(o))}::jsonb`;
const sorted = (o) => Object.entries(o).sort(([a], [b]) => a.localeCompare(b));

/** One statement per table: set `translations -> lang` for the listed rows. */
function update(table, keyColumn, rows, extraWhere = '') {
  if (!rows.length) return '';
  const values = rows.map(([key, fields]) => `  (${str(key)}, ${json(fields)})`);
  return `UPDATE ${table} AS t
   SET translations = jsonb_set(coalesce(t.translations, '{}'::jsonb), '{${LANG}}', v.fields)
  FROM (VALUES
${values.join(',\n')}
  ) AS v(key, fields)
 WHERE t.${keyColumn} = v.key${extraWhere};
`;
}

const exerciseRows = sorted(exercises);
const englishNames = exerciseRows.map(
  ([slug]) => `  (${str(slug)}, ${str(en.exercises[slug].name)})`,
);

const sql = `-- ${NUMBER}: MotionHive's own content in ${LANG === 'ro' ? 'Romanian' : LANG}.
--
-- GENERATED by scripts/build-content-translations.mjs from the reviewed
-- files in docs/content/translations/. Do not edit by hand: fix the source
-- file and regenerate (a correction after this has run ships as a new
-- migration generated the same way).
--
-- Fills the \`translations\` column added by 063 on the exercise library,
-- muscles, equipment and the starter routines. English stays in the base
-- columns. Idempotent: re-running writes the same values.

BEGIN;

${update('muscle', 'slug', sorted(muscles))}
${update('equipment', 'slug', sorted(equipment))}
${update('program', 'id', sorted(starters.programs), " AND t.owner_id IS NULL AND t.source = 'SYSTEM'")}
${update('program_workout', 'id', sorted(starters.workouts))}
${update('prescribed_exercise', 'id', sorted(starters.cues))}
${update('exercise', 'slug', exerciseRows, " AND t.owner_id IS NULL AND t.source = 'SYSTEM'")}
-- Report what did not line up, without failing the deploy: slugs with no
-- system row here, and rows whose English changed after translation (their
-- ${LANG} text may now describe something else).
DO $$
DECLARE
  missing text;
  drifted text;
BEGIN
  SELECT string_agg(v.slug, ', ' ORDER BY v.slug) INTO missing
    FROM (VALUES
${englishNames.join(',\n')}
    ) AS v(slug, en_name)
   WHERE NOT EXISTS (
     SELECT 1 FROM exercise e
      WHERE e.slug = v.slug AND e.owner_id IS NULL AND e.source = 'SYSTEM'
   );
  IF missing IS NOT NULL THEN
    RAISE NOTICE 'translations: no system exercise for slug(s): %', missing;
  END IF;

  SELECT string_agg(DISTINCT e.slug, ', ') INTO drifted
    FROM exercise e
    JOIN (VALUES
${englishNames.join(',\n')}
    ) AS v(slug, en_name) ON v.slug = e.slug
   WHERE e.owner_id IS NULL AND e.source = 'SYSTEM' AND e.name <> v.en_name;
  IF drifted IS NOT NULL THEN
    RAISE NOTICE 'translations: English name changed since translation: %', drifted;
  END IF;
END $$;

COMMIT;
`;

writeFileSync(join(ROOT, MIGRATION), sql);
console.log(`Wrote ${MIGRATION} (${Math.round(sql.length / 1024)} KB)`);
