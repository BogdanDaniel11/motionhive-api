import {
  Catalog,
  DEFAULT_LOCALE,
  Locale,
  MessageKey,
  MessageParams,
  isMessageKey,
  translate,
} from '../../common/i18n';

type NotificationCatalog = Catalog['notifications'];

/**
 * Every notification message, as `<module>.<name>`:
 * `'client.requestReceived'`. Checked at compile time against the
 * catalog, so a builder cannot name a message that does not exist.
 */
export type NotificationMessageKey = {
  [M in keyof NotificationCatalog]: `${M}.${Extract<
    keyof NotificationCatalog[M],
    string
  >}`;
}[keyof NotificationCatalog];

/**
 * What a builder hands to `notify()` instead of finished text: which
 * message, and the raw values it needs. Stored on the notification row
 * and rendered once per reader.
 */
export interface NotificationMessage {
  key: NotificationMessageKey;
  params?: MessageParams;
}

export interface RenderedNotification {
  title: string;
  body: string;
  /** Email button label, when the message defines one. */
  cta: string | null;
  /**
   * The language the text is actually in. English for a row with no
   * message key (written before migration 062, or by a producer not
   * converted yet), whatever the reader asked for, so the email around it
   * can match instead of wrapping English text in a Romanian layout.
   */
  locale: Locale;
}

/** The slice of a notification row that rendering needs. */
export interface StoredNotificationText {
  title: string;
  body: string;
  messageKey: string | null;
  messageParams: MessageParams | null;
}

export function renderNotificationMessage(
  message: NotificationMessage,
  locale: Locale,
): RenderedNotification {
  const base = `notifications.${message.key}`;
  const cta = `${base}.cta`;
  return {
    title: translate(locale, `${base}.title` as MessageKey, message.params),
    body: translate(locale, `${base}.body` as MessageKey, message.params),
    cta: isMessageKey(cta) ? translate(locale, cta, message.params) : null,
    locale,
  };
}

/**
 * Render a stored notification for one reader. Falls back to the stored
 * English text when the row has no key, or names a message that has
 * since been renamed.
 */
export function renderStoredNotification(
  notification: StoredNotificationText,
  locale: Locale,
): RenderedNotification {
  const key = notification.messageKey;
  if (key && isMessageKey(`notifications.${key}.title`)) {
    return renderNotificationMessage(
      {
        key: key as NotificationMessageKey,
        params: notification.messageParams ?? undefined,
      },
      locale,
    );
  }
  return {
    title: notification.title,
    body: notification.body,
    cta: null,
    locale: DEFAULT_LOCALE,
  };
}
