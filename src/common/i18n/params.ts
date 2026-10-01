import { INTL_LOCALE, Locale } from './locale';

/**
 * Values a message can interpolate.
 *
 * Everything here is plain JSON, because notification params are stored
 * in a JSONB column and rendered later, once per reader, in the reader's
 * language. That is why money and dates travel as tagged raw values
 * (`money()`, `day()`, `dayTime()`) instead of pre-formatted strings: a
 * string formatted when the notification was raised would freeze the
 * producer's locale into it.
 */
export interface MoneyParam {
  $money: number;
  currency: string;
}

export interface DateParam {
  $date: string;
  style: 'day' | 'dayTime' | 'month';
  timeZone?: string;
}

export type MessageParam =
  | string
  | number
  | boolean
  | null
  | MoneyParam
  | DateParam;

export type MessageParams = Record<string, MessageParam>;

/** An amount in minor units. Renders as `12.34 EUR` / `12,34 EUR`. */
export function money(amountCents: number, currency: string): MoneyParam {
  return { $money: amountCents, currency };
}

/** A calendar day. Renders as `31 Dec 2026` / `31 decembrie 2026`. */
export function day(date: Date | string): DateParam {
  return { $date: toIso(date), style: 'day' };
}

/**
 * A moment in a specific IANA zone, e.g. a session start in the zone the
 * instructor scheduled it in. Renders as `Mon 15 Jun, 21:00` /
 * `luni, 15 iunie la 21:00`.
 */
export function dayTime(date: Date | string, timeZone: string): DateParam {
  return { $date: toIso(date), style: 'dayTime', timeZone };
}

/**
 * A calendar month, from a `YYYY-MM` key. Renders as `May 2026` /
 * `mai 2026`.
 */
export function month(monthKey: string): DateParam {
  return { $date: `${monthKey}-01`, style: 'month' };
}

export function formatMoney(
  amountCents: number,
  currency: string,
  locale: Locale,
): string {
  const amount = new Intl.NumberFormat(INTL_LOCALE[locale], {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amountCents / 100);
  return `${amount} ${currency.toUpperCase()}`;
}

/**
 * How each language writes a date inside a sentence. English keeps the
 * compact form the product has always used. Romanian spells the weekday
 * and month out: its abbreviations carry full stops ("lun., 15 iun.")
 * that read as broken punctuation mid-sentence.
 */
const DAY_FORMAT: Record<Locale, Intl.DateTimeFormatOptions> = {
  en: { day: '2-digit', month: 'short', year: 'numeric' },
  ro: { day: 'numeric', month: 'long', year: 'numeric' },
};

const DAY_TIME_FORMAT: Record<Locale, Intl.DateTimeFormatOptions> = {
  en: { weekday: 'short', day: '2-digit', month: 'short' },
  ro: { weekday: 'long', day: 'numeric', month: 'long' },
};

export function formatDay(date: Date | string, locale: Locale): string {
  return new Date(date).toLocaleDateString(INTL_LOCALE[locale], {
    ...DAY_FORMAT[locale],
    timeZone: calendarZone(date),
  });
}

export function formatMonth(date: Date | string, locale: Locale): string {
  return new Date(date).toLocaleDateString(INTL_LOCALE[locale], {
    month: 'long',
    year: 'numeric',
    timeZone: calendarZone(date),
  });
}

export function formatDayTime(
  date: Date | string,
  timeZone: string | undefined,
  locale: Locale,
): string {
  return new Date(date).toLocaleString(INTL_LOCALE[locale], {
    ...DAY_TIME_FORMAT[locale],
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone,
  });
}

/**
 * Turn tagged values into display strings for one locale. Plain values
 * pass through untouched so ICU `plural` / `select` still see numbers
 * and keywords.
 */
export function resolveParams(
  params: MessageParams | undefined,
  locale: Locale,
): Record<string, string | number | boolean | null> {
  const out: Record<string, string | number | boolean | null> = {};
  if (!params) return out;
  for (const [name, value] of Object.entries(params)) {
    if (value !== null && typeof value === 'object') {
      out[name] =
        '$money' in value
          ? formatMoney(value.$money, value.currency, locale)
          : value.style === 'day'
            ? formatDay(value.$date, locale)
            : value.style === 'month'
              ? formatMonth(value.$date, locale)
              : formatDayTime(value.$date, value.timeZone, locale);
    } else {
      out[name] = value;
    }
  }
  return out;
}

/**
 * A bare `YYYY-MM-DD` names a calendar day, not a moment: JS parses it
 * as UTC midnight, so it must be printed in UTC or a server west of
 * Greenwich shows the day before. Real timestamps keep the server zone.
 */
function calendarZone(date: Date | string): string | undefined {
  return typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)
    ? 'UTC'
    : undefined;
}

function toIso(date: Date | string): string {
  return date instanceof Date ? date.toISOString() : date;
}
