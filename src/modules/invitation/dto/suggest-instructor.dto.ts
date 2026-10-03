import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SuggestInstructorDto {
  @IsString()
  @MinLength(2, {
    message: 'errors.validation.coachNameTooShort',
  })
  @MaxLength(120)
  coachName!: string;

  @IsEmail({}, { message: 'errors.validation.invalidEmail' })
  email!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'errors.validation.noteTooLong' })
  note?: string;
}
