import { client } from './client';
import { exercise } from './exercise';
import { group } from './group';
import { messaging } from './messaging';
import { payment } from './payment';
import { post } from './post';
import { session } from './session';
import { workout } from './workout';

/**
 * Notification copy, one file per module that raises it:
 * `notifications.<module>.<name>` → `{ title, body, cta? }`.
 *
 * `title` doubles as the email subject and the push title; `body` is the
 * in-app line, the email paragraph and the push body. `cta` is the email
 * button label and is optional (the layout falls back to "Open
 * MotionHive").
 *
 * Messages are ICU MessageFormat, same syntax as the frontend catalogs.
 * One key per full sentence. A value that can be missing (a name, a
 * group name, a due date) arrives as `null`, and the message words that
 * case itself with `{x, select, null {…} other {…}}`: builders never
 * glue fragments together.
 */
export const notifications = {
  client,
  exercise,
  group,
  messaging,
  payment,
  post,
  session,
  workout,
};
