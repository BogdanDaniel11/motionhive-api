import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsIn,
  IsOptional,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SUPPORTED_LOCALES } from '../../../common/i18n';
import type { Locale } from '../../../common/i18n';
import { WaitlistRole } from '../../../common/enums/waitlist-role.enum';

export class CreateWaitlistDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({ example: 'John Doe' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    example: WaitlistRole.INSTRUCTOR,
    enum: WaitlistRole,
    description: 'Whether the person leads activities or participates',
  })
  @IsEnum(WaitlistRole)
  @IsOptional()
  role?: WaitlistRole;

  @ApiPropertyOptional({
    example: 'blog-cta',
    description:
      'Where the signup came from (e.g. blog-cta, homepage, referral)',
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  source?: string;

  @ApiPropertyOptional({
    example: 'ro',
    enum: SUPPORTED_LOCALES,
    description:
      'Language of the page the form was sent from. Decides the language of the confirmation email. Defaults to English.',
  })
  @IsIn(SUPPORTED_LOCALES)
  @IsOptional()
  language?: Locale;
}
