import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class SendFriendInviteDto {
  @IsEmail({}, { message: 'errors.validation.invalidEmail' })
  email!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, {
    message: 'errors.validation.personalMessageTooLong',
  })
  personalMessage?: string;
}
