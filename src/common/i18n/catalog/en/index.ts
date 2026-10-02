import { content } from './content';
import { email } from './email';
import { errors } from './errors';
import { notifications } from './notifications';

/**
 * English is the source of truth: its shape IS the `Catalog` type, so
 * every other language must provide exactly these keys or fail to
 * compile.
 */
export const en = { content, email, errors, notifications };
