-- 064: no dashes in the English exercise library.
--
-- The seeded exercise names come from free-exercise-db, where 29 of them use
-- " - " as a separator ("Barbell Bench Press - Medium Grip"), and 6 sets of
-- instructions use a dash as punctuation. MotionHive copy uses no dashes, and
-- since 065 the English name also shows under each Romanian one, so they are
-- rewritten with a comma (or a period / colon in the instructions).
--
-- Only ownerless SYSTEM rows, matched on slug AND the old text, so a re-run
-- or an already edited row is left alone. Slugs do not change.

BEGIN;

UPDATE exercise SET name = 'Back Flyes, With Bands' WHERE slug = 'back-flyes-with-bands' AND owner_id IS NULL AND source = 'SYSTEM' AND name = 'Back Flyes - With Bands';
UPDATE exercise SET name = 'Barbell Ab Rollout, On Knees' WHERE slug = 'barbell-ab-rollout-on-knees' AND owner_id IS NULL AND source = 'SYSTEM' AND name = 'Barbell Ab Rollout - On Knees';
UPDATE exercise SET name = 'Barbell Bench Press, Medium Grip' WHERE slug = 'barbell-bench-press-medium-grip' AND owner_id IS NULL AND source = 'SYSTEM' AND name = 'Barbell Bench Press - Medium Grip';
UPDATE exercise SET name = 'Barbell Incline Bench Press, Medium Grip' WHERE slug = 'barbell-incline-bench-press-medium-grip' AND owner_id IS NULL AND source = 'SYSTEM' AND name = 'Barbell Incline Bench Press - Medium Grip';
UPDATE exercise SET name = 'Bench Press, Powerlifting' WHERE slug = 'bench-press-powerlifting' AND owner_id IS NULL AND source = 'SYSTEM' AND name = 'Bench Press - Powerlifting';
UPDATE exercise SET name = 'Bench Press, With Bands' WHERE slug = 'bench-press-with-bands' AND owner_id IS NULL AND source = 'SYSTEM' AND name = 'Bench Press - With Bands';
UPDATE exercise SET name = 'Cable Hammer Curls, Rope Attachment' WHERE slug = 'cable-hammer-curls-rope-attachment' AND owner_id IS NULL AND source = 'SYSTEM' AND name = 'Cable Hammer Curls - Rope Attachment';
UPDATE exercise SET name = 'Calf Raises, With Bands' WHERE slug = 'calf-raises-with-bands' AND owner_id IS NULL AND source = 'SYSTEM' AND name = 'Calf Raises - With Bands';
UPDATE exercise SET name = 'Cross Over, With Bands' WHERE slug = 'cross-over-with-bands' AND owner_id IS NULL AND source = 'SYSTEM' AND name = 'Cross Over - With Bands';
UPDATE exercise SET name = 'Crunch, Hands Overhead' WHERE slug = 'crunch-hands-overhead' AND owner_id IS NULL AND source = 'SYSTEM' AND name = 'Crunch - Hands Overhead';
UPDATE exercise SET name = 'Crunch, Legs On Exercise Ball' WHERE slug = 'crunch-legs-on-exercise-ball' AND owner_id IS NULL AND source = 'SYSTEM' AND name = 'Crunch - Legs On Exercise Ball';
UPDATE exercise SET name = 'Dips, Chest Version' WHERE slug = 'dips-chest-version' AND owner_id IS NULL AND source = 'SYSTEM' AND name = 'Dips - Chest Version';
UPDATE exercise SET name = 'Dips, Triceps Version' WHERE slug = 'dips-triceps-version' AND owner_id IS NULL AND source = 'SYSTEM' AND name = 'Dips - Triceps Version';
UPDATE exercise SET name = 'Dumbbell Tricep Extension, Pronated Grip' WHERE slug = 'dumbbell-tricep-extension-pronated-grip' AND owner_id IS NULL AND source = 'SYSTEM' AND name = 'Dumbbell Tricep Extension -Pronated Grip';
UPDATE exercise SET name = 'Hang Clean, Below the Knees' WHERE slug = 'hang-clean-below-the-knees' AND owner_id IS NULL AND source = 'SYSTEM' AND name = 'Hang Clean - Below the Knees';
UPDATE exercise SET name = 'Hang Snatch, Below Knees' WHERE slug = 'hang-snatch-below-knees' AND owner_id IS NULL AND source = 'SYSTEM' AND name = 'Hang Snatch - Below Knees';
UPDATE exercise SET name = 'Incline Dumbbell Flyes, With A Twist' WHERE slug = 'incline-dumbbell-flyes-with-a-twist' AND owner_id IS NULL AND source = 'SYSTEM' AND name = 'Incline Dumbbell Flyes - With A Twist';
UPDATE exercise SET name = 'Isometric Neck Exercise, Front And Back' WHERE slug = 'isometric-neck-exercise-front-and-back' AND owner_id IS NULL AND source = 'SYSTEM' AND name = 'Isometric Neck Exercise - Front And Back';
UPDATE exercise SET name = 'Isometric Neck Exercise, Sides' WHERE slug = 'isometric-neck-exercise-sides' AND owner_id IS NULL AND source = 'SYSTEM' AND name = 'Isometric Neck Exercise - Sides';
UPDATE exercise SET name = 'Lateral Raise, With Bands' WHERE slug = 'lateral-raise-with-bands' AND owner_id IS NULL AND source = 'SYSTEM' AND name = 'Lateral Raise - With Bands';
UPDATE exercise SET name = 'Oblique Crunches, On The Floor' WHERE slug = 'oblique-crunches-on-the-floor' AND owner_id IS NULL AND source = 'SYSTEM' AND name = 'Oblique Crunches - On The Floor';
UPDATE exercise SET name = 'Push Press, Behind the Neck' WHERE slug = 'push-press-behind-the-neck' AND owner_id IS NULL AND source = 'SYSTEM' AND name = 'Push Press - Behind the Neck';
UPDATE exercise SET name = 'Push-Ups, Close Triceps Position' WHERE slug = 'push-ups-close-triceps-position' AND owner_id IS NULL AND source = 'SYSTEM' AND name = 'Push-Ups - Close Triceps Position';
UPDATE exercise SET name = 'Shoulder Press, With Bands' WHERE slug = 'shoulder-press-with-bands' AND owner_id IS NULL AND source = 'SYSTEM' AND name = 'Shoulder Press - With Bands';
UPDATE exercise SET name = 'Sled Drag, Harness' WHERE slug = 'sled-drag-harness' AND owner_id IS NULL AND source = 'SYSTEM' AND name = 'Sled Drag - Harness';
UPDATE exercise SET name = 'Squats, With Bands' WHERE slug = 'squats-with-bands' AND owner_id IS NULL AND source = 'SYSTEM' AND name = 'Squats - With Bands';
UPDATE exercise SET name = 'Triceps Pushdown, Rope Attachment' WHERE slug = 'triceps-pushdown-rope-attachment' AND owner_id IS NULL AND source = 'SYSTEM' AND name = 'Triceps Pushdown - Rope Attachment';
UPDATE exercise SET name = 'Triceps Pushdown, V-Bar Attachment' WHERE slug = 'triceps-pushdown-v-bar-attachment' AND owner_id IS NULL AND source = 'SYSTEM' AND name = 'Triceps Pushdown - V-Bar Attachment';
UPDATE exercise SET name = 'Upright Row, With Bands' WHERE slug = 'upright-row-with-bands' AND owner_id IS NULL AND source = 'SYSTEM' AND name = 'Upright Row - With Bands';
UPDATE exercise SET name = 'Weighted Sit-Ups, With Bands' WHERE slug = 'weighted-sit-ups-with-bands' AND owner_id IS NULL AND source = 'SYSTEM' AND name = 'Weighted Sit-Ups - With Bands';

UPDATE exercise SET instructions = replace(instructions, 'Make sure that - as opposed to a regular bench press - you keep', 'Make sure that, as opposed to a regular bench press, you keep') WHERE slug = 'close-grip-barbell-bench-press' AND owner_id IS NULL AND source = 'SYSTEM';
UPDATE exercise SET instructions = replace(instructions, 'in front of you - while holding the bar at the chosen grip width - bring', 'in front of you, while holding the bar at the chosen grip width, bring') WHERE slug = 'close-grip-front-lat-pulldown' AND owner_id IS NULL AND source = 'SYSTEM';
UPDATE exercise SET instructions = replace(instructions, 'controlled movement - don''t cheat', 'controlled movement. Don''t cheat') WHERE slug = 'crunches' AND owner_id IS NULL AND source = 'SYSTEM';
UPDATE exercise SET instructions = replace(instructions, 'controlled movement - don''t cheat', 'controlled movement. Don''t cheat') WHERE slug = 'decline-crunch' AND owner_id IS NULL AND source = 'SYSTEM';
UPDATE exercise SET instructions = replace(instructions, 'to a tower, and—if possible—position', 'to a tower and, if possible, position') WHERE slug = 'pallof-press' AND owner_id IS NULL AND source = 'SYSTEM';
UPDATE exercise SET instructions = replace(instructions, 'do interval skating — speed skate', 'do interval skating: speed skate') WHERE slug = 'skating' AND owner_id IS NULL AND source = 'SYSTEM';

COMMIT;
