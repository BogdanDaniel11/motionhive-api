import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { NotificationCategory } from '../notification-categories';

/**
 * Configurable channels we expose on the settings UI.
 *
 * In-app is always-on by design (the bell is the user's inbox), and
 * SMS has no transport. Push is here because ten notification types
 * default it on, and a channel a user cannot refuse is not a
 * preference.
 */
export class ConfigurableChannelPreferencesDto {
  @ApiProperty({ description: 'Send email for events in this category' })
  @IsBoolean()
  email: boolean;

  @ApiProperty({
    description: 'Send a push notification for events in this category',
  })
  @IsBoolean()
  push: boolean;
}

/**
 * One category row in the bulk-update payload.
 */
export class CategoryPreferenceUpdateDto {
  @ApiProperty({ enum: NotificationCategory })
  @IsEnum(NotificationCategory)
  category: NotificationCategory;

  @ApiProperty({ type: ConfigurableChannelPreferencesDto })
  @IsObject()
  @ValidateNested()
  @Type(() => ConfigurableChannelPreferencesDto)
  channels: ConfigurableChannelPreferencesDto;
}

/**
 * Body for PATCH /users/me/notification-settings.
 *
 * Whole-payload save — the FE sends one entry per category the user
 * changed. Categories not in the payload keep their previous value
 * (we never wipe; we only upsert behind the scenes).
 *
 * Capped at the number of categories (~6) — no danger of giant
 * payloads.
 */
export class UpdatePreferencesDto {
  @ApiProperty({ type: [CategoryPreferenceUpdateDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => CategoryPreferenceUpdateDto)
  items: CategoryPreferenceUpdateDto[];
}
