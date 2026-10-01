import { toLocale } from './locale';
import {
  day,
  dayTime,
  formatMoney,
  money,
  month,
  resolveParams,
} from './params';
import { isMessageKey, translate } from './translate';

describe('toLocale', () => {
  it('keeps a supported language', () => {
    expect(toLocale('ro')).toBe('ro');
  });

  it.each([undefined, null, '', 'fr', 'RO', 42])(
    'falls back to English for %p',
    (value) => {
      expect(toLocale(value)).toBe('en');
    },
  );
});

describe('translate', () => {
  it('renders the same key in each language', () => {
    expect(translate('en', 'email.layout.openApp')).toBe('Open MotionHive');
    expect(translate('ro', 'email.layout.openApp')).toBe('Deschide MotionHive');
  });

  it('interpolates params', () => {
    expect(
      translate('ro', 'notifications.client.requestReceived.body', {
        name: 'Ana Pop',
      }),
    ).toBe('Ana Pop vrea să te aibă ca antrenor.');
  });

  it('lets the message word a missing name, per language', () => {
    const key = 'notifications.client.requestReceived.body';
    expect(translate('en', key, { name: null })).toBe(
      'A user would like to work with you.',
    );
    expect(translate('ro', key, { name: null })).toBe(
      'Cineva vrea să te aibă ca antrenor.',
    );
  });
});

describe('isMessageKey', () => {
  it('accepts a message and rejects a branch or an unknown path', () => {
    expect(isMessageKey('email.layout.openApp')).toBe(true);
    expect(isMessageKey('email.layout')).toBe(false);
    expect(isMessageKey('notifications.client.renamedAway.title')).toBe(false);
  });
});

describe('message params', () => {
  it("formats money in the reader's number format", () => {
    expect(formatMoney(123450, 'eur', 'en')).toBe('1,234.50 EUR');
    expect(formatMoney(123450, 'eur', 'ro')).toBe('1.234,50 EUR');
  });

  it('formats tagged values per language and leaves plain ones alone', () => {
    const params = {
      amount: money(1000, 'ron'),
      due: day('2026-12-31T00:00:00Z'),
      startsAt: dayTime('2026-06-15T18:00:00Z', 'Europe/Bucharest'),
      count: 3,
      name: 'Ana',
    };
    expect(resolveParams(params, 'en')).toEqual({
      amount: '10.00 RON',
      due: '31 Dec 2026',
      startsAt: 'Mon 15 Jun, 21:00',
      count: 3,
      name: 'Ana',
    });
    expect(resolveParams(params, 'ro')).toEqual({
      amount: '10,00 RON',
      due: '31 decembrie 2026',
      startsAt: 'luni, 15 iunie la 21:00',
      count: 3,
      name: 'Ana',
    });
  });

  it('prints a bare date as that calendar day, and a month by name', () => {
    expect(resolveParams({ start: day('2026-06-22') }, 'en')).toEqual({
      start: '22 Jun 2026',
    });
    expect(resolveParams({ period: month('2026-05') }, 'en')).toEqual({
      period: 'May 2026',
    });
    expect(resolveParams({ period: month('2026-05') }, 'ro')).toEqual({
      period: 'mai 2026',
    });
  });

  it('survives a JSON round trip, as stored params do', () => {
    const stored = JSON.parse(
      JSON.stringify({ amount: money(550, 'eur') }),
    ) as { amount: ReturnType<typeof money> };
    expect(resolveParams(stored, 'ro')).toEqual({ amount: '5,50 EUR' });
  });
});
