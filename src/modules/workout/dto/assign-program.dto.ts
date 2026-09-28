import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

/**
 * Body for `POST /program-assignments`. Triggers the deep-copy
 * transaction — the entire program tree is cloned per-client.
 */
export class AssignProgramDto {
  @ApiProperty({ example: 'a1b2c3d4-0000-1111-2222-3333abcd4444' })
  @IsUUID('4')
  programId: string;

  @ApiProperty({ example: '5c1a8b9d-2e3f-4a01-9b8c-7d6e5f4a3b2c' })
  @IsUUID('4')
  clientId: string;

  /** ISO date (no time). Day 0 of the program lands on this date. */
  @ApiProperty({ example: '2026-06-09' })
  @IsDateString({ strict: true })
  startDate: string;

  /**
   * Which weekdays the program's training days land on, ISO 1=Mon..7=Sun.
   *
   * A program is authored against day slots — "Upper A on day 1, Lower on
   * day 3" — and by default those map onto the calendar by counting forward
   * from `startDate`. Assign on a Wednesday and day 1 lands Wednesday,
   * which is rarely what the coach drew.
   *
   * Supplying this remaps them in order: the program's first distinct day
   * goes to the first weekday here, its second to the second, and so on.
   * The count must match the number of distinct days the program uses, so
   * a three-day week cannot be squeezed into two.
   *
   * Omitted, behaviour is exactly as before.
   */
  @ApiPropertyOptional({ example: [1, 3, 5], minimum: 1, maximum: 7 })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  @IsInt({ each: true })
  @Min(1, { each: true })
  @Max(7, { each: true })
  daysOfWeek?: number[];

  @ApiPropertyOptional({ maxLength: 2000 })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
