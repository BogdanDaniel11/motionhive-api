import { DevicePlatform } from '../entities/device-token.entity';

/**
 * A notification as the push system understands it, before any vendor
 * gets involved.
 *
 * Everything above this type is platform-agnostic: the catalogue, the
 * channel resolution, the receipt, the preferences. Only a transport
 * turns one of these into Apple's shape or Google's. That boundary is
 * the reason adding Android later touches one new file and nothing
 * else — and the reason iOS could move from APNs to Firebase without
 * anything upstream noticing.
 */
export interface PushMessage {
  /** Notification title, as stored on the notification row. */
  title: string;
  /** Body text, as stored on the notification row. */
  body: string;
  /**
   * Deep-link payload, forwarded verbatim to the device so the app can
   * route the tap. Values are stringified by the transport because both
   * APNs and FCM restrict what may travel in custom keys.
   */
  data?: Record<string, string>;
  /**
   * App icon badge count. iOS renders this natively; Android launchers
   * vary, so a transport may ignore it.
   */
  badge?: number;
  /**
   * Groups related alerts so a later one replaces an earlier one rather
   * than stacking. Used for reminders about the same session.
   */
  collapseKey?: string;
}

/**
 * What happened when we handed one message to one device.
 *
 * `retryable` and `tokenDead` are deliberately separate. A dead token is
 * not a failure to retry — the device is gone and the row should be
 * revoked — whereas a transport blip is. Each vendor signals these
 * differently, so normalising them here keeps that vendor knowledge
 * inside the adapter.
 */
export type PushResult =
  | { ok: true }
  | { ok: false; reason: string; retryable: boolean; tokenDead: boolean };

/**
 * One vendor's way of delivering a `PushMessage`.
 *
 * Implementations must not throw: a delivery problem is a returned
 * `PushResult`, because the caller decides what a failure means for the
 * receipt and the retry budget.
 */
export interface PushTransport {
  /** Which device rows this transport can deliver to. */
  readonly platform: DevicePlatform;

  /**
   * False when the transport has no credentials configured. The
   * dispatcher skips it rather than failing, so a deployment without
   * APNs keys behaves like one without Redis: degraded, not broken.
   */
  isConfigured(): boolean;

  send(token: string, message: PushMessage): Promise<PushResult>;
}
