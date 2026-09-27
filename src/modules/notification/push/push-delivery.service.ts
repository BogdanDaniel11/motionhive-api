import { Inject, Injectable } from '@nestjs/common';
import type { LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { DeviceTokenService } from '../services/device-token.service';
import { NotificationReceiptService } from '../services/notification-receipt.service';
import { ApnsTransport } from './apns.transport';
import { FcmTransport } from './fcm.transport';
import { PushMessage, PushTransport } from './push-transport';

/** Outcome across every device a user has. */
export interface PushDeliveryOutcome {
  sent: number;
  failed: number;
  revoked: number;
  /** True when at least one failure is worth another attempt. */
  retryable: boolean;
  /** Short summary for the receipt when nothing was delivered. */
  reason?: string;
}

/**
 * Delivers one notification to every device a user has, whatever kind
 * of device that is.
 *
 * This is the "one place" half of push: it owns fanning out to a
 * user's devices, translating a notification into a neutral
 * `PushMessage`, revoking tokens the vendor says are dead, and
 * reporting one outcome for the receipt. None of that is Apple- or
 * Google-specific — the two transports below are the only code that
 * knows which vendor a device belongs to.
 *
 * Devices are read at delivery time rather than carried in the job
 * payload — deliberately unlike the email job, which pre-builds
 * everything. A token can be revoked or replaced between a
 * notification being raised and the worker picking it up, and sending
 * to a token we already know is gone wastes an attempt.
 */
@Injectable()
export class PushDeliveryService {
  private readonly transports: PushTransport[];

  constructor(
    private readonly devices: DeviceTokenService,
    private readonly receipts: NotificationReceiptService,
    apns: ApnsTransport,
    fcm: FcmTransport,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    // One entry per platform. Each reports itself unconfigured until
    // its credentials exist, so iOS can ship and be tested long before
    // a Firebase project does.
    this.transports = [apns, fcm];
  }

  /** True when at least one transport could actually send something. */
  isAnyTransportConfigured(): boolean {
    return this.transports.some((t) => t.isConfigured());
  }

  async deliver(
    userId: string,
    message: PushMessage,
  ): Promise<PushDeliveryOutcome> {
    const devices = await this.devices.listActiveForUser(userId);

    if (devices.length === 0) {
      return {
        sent: 0,
        failed: 0,
        revoked: 0,
        retryable: false,
        reason: 'no_devices',
      };
    }

    const outcome: PushDeliveryOutcome = {
      sent: 0,
      failed: 0,
      revoked: 0,
      retryable: false,
    };
    const reasons: string[] = [];

    // Sent in parallel: one slow device must not hold up the others,
    // and a user rarely has more than a handful.
    await Promise.all(
      devices.map(async (device) => {
        const transport = this.transports.find(
          (t) => t.platform === device.platform,
        );

        if (!transport || !transport.isConfigured()) {
          // No adapter for this platform yet. Not a failure to retry —
          // retrying changes nothing until one is deployed.
          reasons.push(`no_transport:${device.platform}`);
          return;
        }

        const result = await transport.send(device.token, message);

        if (result.ok) {
          outcome.sent += 1;
          return;
        }

        outcome.failed += 1;
        reasons.push(result.reason);

        if (result.tokenDead) {
          // The device is gone. Revoking stops every future send to it
          // and keeps the retry budget for problems that can resolve.
          await this.devices.markStale(device.id);
          outcome.revoked += 1;
          return;
        }

        if (result.retryable) outcome.retryable = true;
      }),
    );

    // One success is enough: the user got the message. Retrying for a
    // second device would re-deliver to the first.
    if (outcome.sent > 0) outcome.retryable = false;
    if (outcome.sent === 0 && reasons.length > 0) {
      outcome.reason = reasons[0];
    }

    this.logger.log?.(
      `[PUSH] user=${userId} sent=${outcome.sent} failed=${outcome.failed} revoked=${outcome.revoked}`,
      'PushDeliveryService',
    );

    return outcome;
  }

  /**
   * Record what happened on the receipt, using the same vocabulary the
   * email channel uses so the audit field reads consistently.
   */
  async recordOutcome(
    receiptId: string,
    outcome: PushDeliveryOutcome,
  ): Promise<void> {
    const status =
      outcome.sent > 0
        ? 'sent'
        : (`failed:${(outcome.reason ?? 'unknown').slice(0, 200)}` as const);

    await this.receipts.recordChannelOutcome(receiptId, 'push', status);
  }
}
