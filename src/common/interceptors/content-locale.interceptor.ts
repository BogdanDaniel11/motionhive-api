import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RAW_CONTENT_KEY } from '../decorators/raw-content.decorator';
import { LocaleSource, localizeContent, requestLocale } from '../i18n';

/**
 * Content Locale Interceptor
 *
 * Answers with MotionHive's own content (exercise library, muscles,
 * equipment, starter routines) in the language of the request: the
 * `Accept-Language` the apps send, else the account's language, else
 * English. Rows keep their English columns plus a `translations` column
 * (migration 063); this swaps the reader's language into the same fields,
 * so the apps read `name` as before and simply get Romanian. See
 * `localizeContent` for the rules.
 *
 * A query that lists its attributes must include `translations` for this
 * to see it. Admin controllers opt out with `@RawContent()`.
 *
 * Applied globally in AppModule, registered before CamelCaseInterceptor so
 * it runs after it, on plain camelCased JSON.
 */
@Injectable()
export class ContentLocaleInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const raw = this.reflector.getAllAndOverride<boolean>(RAW_CONTENT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (raw || context.getType() !== 'http') return next.handle();

    const locale = requestLocale(
      context.switchToHttp().getRequest<LocaleSource>(),
    );
    return next
      .handle()
      .pipe(map((data: unknown) => localizeContent(data, locale)));
  }
}
