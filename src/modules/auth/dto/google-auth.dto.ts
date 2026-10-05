import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SUPPORTED_LOCALES } from '../../../common/i18n';
import type { Locale } from '../../../common/i18n';

/**
 * DTO for Sign in with Google (token flow).
 * Frontend obtains ID token from Google Sign-In, sends it here.
 */
export class GoogleAuthDto {
  @ApiProperty({
    description: 'Google ID token from the frontend (Google Sign-In)',
    example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  @IsNotEmpty()
  idToken: string;

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
