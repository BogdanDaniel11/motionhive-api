import type { Catalog, MessageKey } from './catalog';
import { DEFAULT_LOCALE, Locale, isLocale, toLocale } from './locale';
import type { MessageParams } from './params';
import { isMessageKey, translate } from './translate';

type ErrorCatalog = Catalog['errors'];

/**
 * Every error message, as `<module>.<name>`: `'client.selfInvite'`.
 * Checked at compile time against the catalog.
 */
export type ErrorKey = {
  [M in keyof ErrorCatalog]: `${M}.${Extract<keyof ErrorCatalog[M], string>}`;
}[keyof ErrorCatalog];

/**
 * The body of an exception whose message is translated per caller.
 * `message` is the English rendering, so logs, tests and any caller that
 * reads `exception.message` keep seeing English; the global exception
 * filter replaces it with the caller's language on the way out.
 */
export interface ApiErrorBody {
  message: string;
  messageKey: ErrorKey;
  messageParams?: MessageParams;
}

/**
 * An error message from the catalog.
 *
 *   throw new BadRequestException(apiError('client.selfInvite'));
 *   throw new NotFoundException(apiError('venue.notFound'));
 *   throw new ConflictException(apiError('group.memberLimit', { max: 50 }));
 */
export function apiError(key: ErrorKey, params?: MessageParams): ApiErrorBody {
  return {
    message: translate(DEFAULT_LOCALE, `errors.${key}` as MessageKey, params),
    messageKey: key,
    ...(params ? { messageParams: params } : {}),
  };
}

export function isApiErrorBody(value: unknown): value is ApiErrorBody {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof (value as ApiErrorBody).messageKey === 'string' &&
    isMessageKey(`errors.${(value as ApiErrorBody).messageKey}`)
  );
}

/** Render an error body in one language. */
export function renderApiError(body: ApiErrorBody, locale: Locale): string {
  return translate(
    locale,
    `errors.${body.messageKey}` as MessageKey,
    body.messageParams,
  );
}

/** The parts of a request that decide its language. */
export interface LocaleSource {
  headers?: Record<string, string | string[] | undefined>;
  user?: { language?: string | null };
}

/**
 * The language to answer a request in. The apps send their current UI
 * language as `Accept-Language`, which wins: it is what the person is
 * looking at right now. Then the signed-in user's saved language, then
 * English.
 */
export function requestLocale(req: LocaleSource): Locale {
  const header = req.headers?.['accept-language'];
  const value: string | undefined = Array.isArray(header) ? header[0] : header;
  if (value) {
    for (const part of value.split(',')) {
      const base = part.split(';')[0].trim().toLowerCase().split('-')[0];
      if (isLocale(base)) return base;
    }
  }
  return toLocale(req.user?.language);
}

/**
 * `exceptionFactory` for the global ValidationPipe.
 *
 * class-validator's own messages name DTO properties in English
 * ("title must be longer than…"), which neither language can show a
 * person. So a failed rule answers with one translated sentence, unless
 * the DTO named a catalog message for it (`message:
 * 'errors.validation.passwordsDoNotMatch'`), which is then used as is.
 * The raw messages travel in `details`, for developers.
 */
export function validationErrorBody(
  errors: ValidationErrorLike[],
): ApiErrorBody & { details: string[] } {
  const details: string[] = [];
  const collect = (list: ValidationErrorLike[]) => {
    for (const error of list) {
      details.push(...Object.values(error.constraints ?? {}));
      collect(error.children ?? []);
    }
  };
  collect(errors);

  const named = details.find(
    (message) => message.startsWith('errors.') && isMessageKey(message),
  );
  const key = (
    named ? named.slice('errors.'.length) : 'common.invalidInput'
  ) as ErrorKey;
  return {
    ...apiError(key),
    details: details.map((message) =>
      message.startsWith('errors.') && isMessageKey(message)
        ? translate(DEFAULT_LOCALE, message)
        : message,
    ),
  };
}

/** The slice of class-validator's `ValidationError` this needs. */
export interface ValidationErrorLike {
  constraints?: Record<string, string>;
  children?: ValidationErrorLike[];
}
