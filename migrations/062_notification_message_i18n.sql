-- 062: let a notification be rendered in each reader's language.
--
-- Until now a notification stored finished English text (`title`, `body`),
-- and one row is shared by every recipient of a fan-out, so there was no
-- place for a second language. A notification now also stores WHICH message
-- it is and the raw values that go into it:
--
--   message_key     a key in the API's catalog (src/common/i18n/catalog),
--                   e.g. 'client.requestReceived'
--   message_params  the values the message interpolates (names, amounts in
--                   minor units, ISO timestamps), never pre-formatted text
--
-- The API renders title/body from these when a notification is read, and
-- again when it is emailed or pushed, in that person's language.
--
-- `title` / `body` stay, holding the English rendering: they keep rows
-- written before this migration readable, and they are the fallback if a
-- key is ever renamed out from under an old row.
--
-- Also normalises `user.language`. The column accepted any 5 characters;
-- the API now only accepts supported languages, and reads this column to
-- pick the language above.
--
-- Idempotent: IF NOT EXISTS on the columns; the UPDATE matches nothing on a
-- re-run.

BEGIN;

ALTER TABLE notification
  ADD COLUMN IF NOT EXISTS message_key VARCHAR(120),
  ADD COLUMN IF NOT EXISTS message_params JSONB;

UPDATE "user"
SET language = 'en'
WHERE language IS NULL OR language NOT IN ('en', 'ro');

COMMIT;
