-- 061: make `program.duration_days` agree with the weeks that hold workouts.
--
-- `duration_days` was accepted as a free-form hint — nothing checked it against
-- the program's actual weeks — but `computeEndDate` treated it as fact and
-- counted it forward from the start date. A program declared 3 weeks with 4
-- weeks of workouts therefore gave every client an end date a week before
-- their own last session, while `assigned_workout` rows stayed scheduled past
-- it. The service now derives the end date from the last workout; this fixes
-- the rows already written.
--
-- Only ever lengthens. Shrinking would mean deleting workouts, which is a
-- coach's decision, not a migration's — the service refuses it outright while
-- clients are mid-program.
--
-- Routines (`is_single_workout`) are left alone: they repeat indefinitely and
-- a NULL duration is the correct "no fixed end".
--
-- Idempotent: both statements only match rows that still disagree.

BEGIN;

-- 1. Stretch the declared length to cover the weeks actually built.
UPDATE program p
SET duration_days = w.used_weeks * 7,
    updated_at = CURRENT_TIMESTAMP
FROM (
  SELECT program_id, max(week_index) + 1 AS used_weeks
  FROM program_workout
  GROUP BY program_id
) w
WHERE w.program_id = p.id
  AND p.is_single_workout = false
  AND p.duration_days IS NOT NULL
  AND p.duration_days < w.used_weeks * 7;

-- 2. Push any assignment whose plan outruns its own end date out to the last
--    session the client is actually scheduled for.
UPDATE program_assignment pa
SET end_date = a.last_workout,
    updated_at = CURRENT_TIMESTAMP
FROM (
  SELECT program_assignment_id, max(scheduled_date) AS last_workout
  FROM assigned_workout
  WHERE scheduled_date IS NOT NULL
  GROUP BY program_assignment_id
) a
WHERE a.program_assignment_id = pa.id
  AND pa.end_date IS NOT NULL
  AND pa.end_date < a.last_workout;

COMMIT;
