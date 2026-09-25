import { DevicePlatform } from '../entities/device-token.entity';
import { PushDeliveryService } from './push-delivery.service';
import type { ApnsTransport } from './apns.transport';
import type { FcmTransport } from './fcm.transport';
import type { PushResult } from './push-transport';
import type { DeviceTokenService } from '../services/device-token.service';
import type { NotificationReceiptService } from '../services/notification-receipt.service';
import { makeSilentLogger } from '../../../../test/helpers/sequelize-mocks';

function device(
  id: string,
  platform = DevicePlatform.IOS,
  token = `tok-${id}`,
) {
  return { id, platform, token };
}

const MESSAGE = { title: 'Rest over', body: 'Time for your next set.' };

describe('PushDeliveryService', () => {
  let devices: { listActiveForUser: jest.Mock; markStale: jest.Mock };
  let receipts: { recordChannelOutcome: jest.Mock };
  let apns: {
    platform: DevicePlatform;
    isConfigured: jest.Mock;
    send: jest.Mock;
  };
  let fcm: {
    platform: DevicePlatform;
    isConfigured: jest.Mock;
    send: jest.Mock;
  };
  let service: PushDeliveryService;

  beforeEach(() => {
    devices = {
      listActiveForUser: jest.fn().mockResolvedValue([]),
      markStale: jest.fn().mockResolvedValue(undefined),
    };
    receipts = { recordChannelOutcome: jest.fn().mockResolvedValue(undefined) };
    apns = {
      platform: DevicePlatform.IOS,
      isConfigured: jest.fn().mockReturnValue(true),
      send: jest.fn<Promise<PushResult>, unknown[]>(),
    };
    fcm = {
      platform: DevicePlatform.ANDROID,
      isConfigured: jest.fn().mockReturnValue(true),
      send: jest.fn<Promise<PushResult>, unknown[]>(),
    };

    service = new PushDeliveryService(
      devices as unknown as DeviceTokenService,
      receipts as unknown as NotificationReceiptService,
      apns as unknown as ApnsTransport,
      fcm as unknown as FcmTransport,
      makeSilentLogger(),
    );
  });

  it('delivers to every device the user has', async () => {
    devices.listActiveForUser.mockResolvedValue([device('a'), device('b')]);
    apns.send.mockResolvedValue({ ok: true });

    const outcome = await service.deliver('u-1', MESSAGE);

    expect(outcome).toMatchObject({ sent: 2, failed: 0, revoked: 0 });
    expect(apns.send).toHaveBeenCalledTimes(2);
    expect(apns.send).toHaveBeenCalledWith('tok-a', MESSAGE);
  });

  it('does not retry a user who has no devices', async () => {
    const outcome = await service.deliver('u-1', MESSAGE);

    expect(outcome).toMatchObject({
      sent: 0,
      retryable: false,
      reason: 'no_devices',
    });
    expect(apns.send).not.toHaveBeenCalled();
  });

  it('revokes a token the vendor says is dead, and does not retry it', async () => {
    devices.listActiveForUser.mockResolvedValue([device('a')]);
    apns.send.mockResolvedValue({
      ok: false,
      reason: 'Unregistered',
      retryable: false,
      tokenDead: true,
    });

    const outcome = await service.deliver('u-1', MESSAGE);

    expect(devices.markStale).toHaveBeenCalledWith('a');
    expect(outcome).toMatchObject({ sent: 0, revoked: 1, retryable: false });
  });

  it('retries a transient failure', async () => {
    devices.listActiveForUser.mockResolvedValue([device('a')]);
    apns.send.mockResolvedValue({
      ok: false,
      reason: 'ServiceUnavailable',
      retryable: true,
      tokenDead: false,
    });

    const outcome = await service.deliver('u-1', MESSAGE);

    expect(outcome).toMatchObject({ sent: 0, failed: 1, retryable: true });
    expect(devices.markStale).not.toHaveBeenCalled();
  });

  it('does not retry when one device succeeded and another did not', async () => {
    devices.listActiveForUser.mockResolvedValue([device('a'), device('b')]);
    apns.send.mockResolvedValueOnce({ ok: true }).mockResolvedValueOnce({
      ok: false,
      reason: 'ServiceUnavailable',
      retryable: true,
      tokenDead: false,
    });

    const outcome = await service.deliver('u-1', MESSAGE);

    // The user got the message. Retrying would deliver it twice to the
    // device that already has it.
    expect(outcome).toMatchObject({ sent: 1, failed: 1, retryable: false });
  });

  it('routes each device to the transport for its platform', async () => {
    devices.listActiveForUser.mockResolvedValue([
      device('iphone', DevicePlatform.IOS, 'tok-ios'),
      device('pixel', DevicePlatform.ANDROID, 'tok-android'),
    ]);
    apns.send.mockResolvedValue({ ok: true });
    fcm.send.mockResolvedValue({ ok: true });

    const outcome = await service.deliver('u-1', MESSAGE);

    expect(apns.send).toHaveBeenCalledWith('tok-ios', MESSAGE);
    expect(fcm.send).toHaveBeenCalledWith('tok-android', MESSAGE);
    expect(outcome.sent).toBe(2);
  });

  it('skips a platform whose transport has no credentials, and still delivers the other', async () => {
    // The state iOS ships in before a Firebase project exists.
    fcm.isConfigured.mockReturnValue(false);
    devices.listActiveForUser.mockResolvedValue([
      device('iphone', DevicePlatform.IOS, 'tok-ios'),
      device('pixel', DevicePlatform.ANDROID, 'tok-android'),
    ]);
    apns.send.mockResolvedValue({ ok: true });

    const outcome = await service.deliver('u-1', MESSAGE);

    expect(fcm.send).not.toHaveBeenCalled();
    expect(outcome).toMatchObject({ sent: 1, retryable: false });
  });

  it('revokes a dead Android token the same way as an Apple one', async () => {
    devices.listActiveForUser.mockResolvedValue([
      device('pixel', DevicePlatform.ANDROID),
    ]);
    fcm.send.mockResolvedValue({
      ok: false,
      reason: 'messaging/registration-token-not-registered',
      retryable: false,
      tokenDead: true,
    });

    const outcome = await service.deliver('u-1', MESSAGE);

    expect(devices.markStale).toHaveBeenCalledWith('pixel');
    expect(outcome).toMatchObject({ revoked: 1, retryable: false });
  });

  it('skips an unconfigured transport rather than failing', async () => {
    apns.isConfigured.mockReturnValue(false);
    devices.listActiveForUser.mockResolvedValue([device('a')]);

    const outcome = await service.deliver('u-1', MESSAGE);

    expect(apns.send).not.toHaveBeenCalled();
    expect(outcome.retryable).toBe(false);
  });

  it('records sent on the receipt when anything landed', async () => {
    await service.recordOutcome('r-1', {
      sent: 1,
      failed: 0,
      revoked: 0,
      retryable: false,
    });

    expect(receipts.recordChannelOutcome).toHaveBeenCalledWith(
      'r-1',
      'push',
      'sent',
    );
  });

  it('records the reason on the receipt when nothing landed', async () => {
    await service.recordOutcome('r-1', {
      sent: 0,
      failed: 1,
      revoked: 0,
      retryable: false,
      reason: 'BadDeviceToken',
    });

    expect(receipts.recordChannelOutcome).toHaveBeenCalledWith(
      'r-1',
      'push',
      'failed:BadDeviceToken',
    );
  });
});
