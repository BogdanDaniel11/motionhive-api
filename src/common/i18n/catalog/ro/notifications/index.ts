import type { Catalog } from '../..';
import { client } from './client';
import { exercise } from './exercise';
import { group } from './group';
import { messaging } from './messaging';
import { payment } from './payment';
import { post } from './post';
import { session } from './session';
import { workout } from './workout';

export const notifications: Catalog['notifications'] = {
  client,
  exercise,
  group,
  messaging,
  payment,
  post,
  session,
  workout,
};
