import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

/**
 * Body for `POST /programs/:id/workouts/copy-day`.
 *
 * Copies one day's training into the same day slot of other weeks — "make
 * Monday the same for weeks 2 to 5". The target weeks come as an array for
 * the same reason `copy-week` exists at all: a client looping one request
 * per week walks the same tree repeatedly and trips the throttle.
 *
 * `toDayIndex` lets the copy land on a different day — "Monday's work, but
 * on Thursday". It is only meaningful for a single target week: repeating a
 * day across a block means the same day each time, and asking "which day?"
 * once per week would be a different feature. The service rejects the
 * combination rather than guessing.
 */
export class CopyProgramDayDto {
  /** 0-based week the day is copied from. */
  @ApiProperty({ example: 0, minimum: 0, maximum: 103 })
  @IsInt()
  @Min(0)
  @Max(103)
  fromWeekIndex: number;

  /** 0-based day within that week — the slot that is copied, and copied into. */
  @ApiProperty({ example: 0, minimum: 0, maximum: 6 })
  @IsInt()
  @Min(0)
  @Max(6)
  dayIndex: number;

  /**
   * 0-based weeks to copy into. Whatever sits in the target day slot is
   * replaced, the same way `copy-week` replaces a week — one rule for both,
   * so the outcome is never a surprise.
   */
  @ApiProperty({ example: [1, 2, 3], minimum: 0, maximum: 103 })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(104)
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(103, { each: true })
  toWeekIndexes: number[];

  /**
   * 0-based day to copy *into*. Defaults to `dayIndex`, which is the
   * repeating-block case. Only accepted with exactly one target week — see
   * the class comment.
   */
  @ApiPropertyOptional({ example: 3, minimum: 0, maximum: 6 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(6)
  toDayIndex?: number;
}
