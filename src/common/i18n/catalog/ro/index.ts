import type { Catalog } from '..';
import { content } from './content';
import { email } from './email';
import { errors } from './errors';
import { notifications } from './notifications';

export const ro: Catalog = { content, email, errors, notifications };
