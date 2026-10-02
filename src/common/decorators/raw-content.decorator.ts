import { SetMetadata } from '@nestjs/common';

/**
 * Raw Content Decorator
 *
 * Answers with rows as stored: English base text plus the `translations`
 * column, instead of the reader's language. For admin screens, which show
 * and edit what is in the database. See ContentLocaleInterceptor.
 *
 * Usage (on a controller or a route):
 * @RawContent()
 * @Controller('admin/db')
 */
export const RAW_CONTENT_KEY = 'rawContent';
export const RawContent = () => SetMetadata(RAW_CONTENT_KEY, true);
