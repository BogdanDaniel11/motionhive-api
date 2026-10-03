-- 063: let MotionHive's own content be read in each reader's language.
--
-- The exercise library, muscles, equipment and the starter routines are
-- ours (no owner), and until now they existed in English only. Each table
-- that holds such text gets one column:
--
--   translations  JSONB, NULL unless translated:
--                 {"ro": {"name": "Genuflexiuni cu haltera", "instructions": "..."}}
--
-- Keys inside a language are the API field names (`name`, `commonName`,
-- `instructions`, `notes`...). The English columns stay as they are: they
-- are the base text and the fallback, field by field. The API swaps in the
-- reader's language when it answers (ContentLocaleInterceptor), so the
-- frontends keep reading the same fields.
--
-- Only our rows carry translations. Text a person wrote (a coach's custom
-- exercise, a copy of a starter) is shown as written, in one language. The
-- CHECKs below enforce that where the table knows who owns a row.
--
-- Search: `exercise.search_name` holds the English name and every
-- translated name, lowercased and without diacritics, kept in sync by
-- Postgres. A Romanian reader typing "squats" finds "Genuflexiuni cu
-- haltera"; typing "flotari" finds "Flotări", custom exercises included.
--
-- A third language needs no schema change: it is one more key in the JSON.
--
-- Idempotent: IF NOT EXISTS / OR REPLACE throughout, constraints dropped
-- before they are added.

BEGIN;

CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Lowercase, no diacritics: "Îndreptări" becomes "indreptari". unaccent() is
-- only STABLE (its dictionary could change), so this wrapper pins the
-- dictionary and is declared IMMUTABLE, which a generated column and an
-- index need. Standard Postgres practice.
CREATE OR REPLACE FUNCTION fold_for_search(input text) RETURNS text
  LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT
  AS $$ SELECT lower(public.unaccent('public.unaccent'::regdictionary, input)) $$;

-- Every translated `name` in a translations object, space separated.
CREATE OR REPLACE FUNCTION translated_names(translations jsonb) RETURNS text
  LANGUAGE sql IMMUTABLE PARALLEL SAFE
  AS $$ SELECT coalesce(string_agg(l.value ->> 'name', ' '), '')
          FROM jsonb_each(coalesce(translations, '{}'::jsonb)) AS l $$;

ALTER TABLE exercise            ADD COLUMN IF NOT EXISTS translations JSONB;
ALTER TABLE muscle              ADD COLUMN IF NOT EXISTS translations JSONB;
ALTER TABLE equipment           ADD COLUMN IF NOT EXISTS translations JSONB;
ALTER TABLE program             ADD COLUMN IF NOT EXISTS translations JSONB;
ALTER TABLE program_workout     ADD COLUMN IF NOT EXISTS translations JSONB;
ALTER TABLE prescribed_exercise ADD COLUMN IF NOT EXISTS translations JSONB;

ALTER TABLE exercise DROP CONSTRAINT IF EXISTS exercise_translations_system_only;
ALTER TABLE exercise ADD CONSTRAINT exercise_translations_system_only CHECK (
  translations IS NULL
  OR (source = 'SYSTEM' AND jsonb_typeof(translations) = 'object')
);

ALTER TABLE program DROP CONSTRAINT IF EXISTS program_translations_system_only;
ALTER TABLE program ADD CONSTRAINT program_translations_system_only CHECK (
  translations IS NULL
  OR (source = 'SYSTEM' AND jsonb_typeof(translations) = 'object')
);

ALTER TABLE exercise ADD COLUMN IF NOT EXISTS search_name TEXT
  GENERATED ALWAYS AS (
    fold_for_search(name || ' ' || translated_names(translations))
  ) STORED;

-- Serves both the "contains" match (LIKE '%term%') and the close match
-- (word similarity, which forgives plurals and missing letters).
CREATE INDEX IF NOT EXISTS idx_exercise_search_name_trgm
  ON exercise USING gin (search_name gin_trgm_ops);

COMMIT;
