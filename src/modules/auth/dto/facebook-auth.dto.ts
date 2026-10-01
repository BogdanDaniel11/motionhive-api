import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SUPPORTED_LOCALES } from '../../../common/i18n';
import type { Locale } from '../../../common/i18n';

/**
 * DTO for Sign in with Facebook (token flow).
 * Frontend obtains access token from Facebook Login SDK, sends it here.
 */
export class FacebookAuthDto {
  @ApiProperty({
    description: 'Facebook access token from the frontend (Facebook Login)',
    example: 'EAAGm0PX4ZCps8BA...',
  })
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @ApiPropertyOptional({
    example: 'ro',
    enum: SUPPORTED_LOCALES,
    description:
      'Language the person is using the app in. Only applied when this sign-in creates the account.',
  })
  @IsIn(SUPPORTED_LOCALES)
  @IsOptional()
  language?: Locale;
}
