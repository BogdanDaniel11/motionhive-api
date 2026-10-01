import type { Locale } from '../../src/common/i18n';
import {
  NotificationMessage,
  renderNotificationMessage,
} from '../../src/modules/notification/notification-message';

/**
 * The text a `notify()` call will show, for specs that assert on wording.
 *
 * Builders hand `notify()` a catalog key plus raw params, not finished
 * text, so a spec renders it the same way the service does. English by
 * default; pass `'ro'` to check a translation.
 */
export function notificationText(
  params: unknown,
  locale: Locale = 'en',
): { title: string; body: string; cta: string | null } {
  const { message } = params as { message?: NotificationMessage };
  if (!message) {
    throw new Error('notify() was called without a catalog message');
  }
  return renderNotificationMessage(message, locale);
}
