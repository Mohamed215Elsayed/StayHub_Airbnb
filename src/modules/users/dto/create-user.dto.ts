import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsPhoneNumber,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateUserDto {
  @ApiProperty({ example: 'Ahmed Hassan', description: 'Full name' })
  @Transform(({ value }) => value?.trim())
  @IsString({ message: i18nValidationMessage('user.NAME_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('user.NAME_REQUIRED') })
  @MinLength(2, {
    message: i18nValidationMessage('user.NAME_MIN_LENGTH'),
  })
  @MaxLength(100, { message: i18nValidationMessage('user.NAME_MAX_LENGTH') })
  name!: string;

  @ApiProperty({ example: 'ahmed@example.com', description: 'Email address' })
  @Transform(({ value }) => value?.trim().toLowerCase())
  @IsEmail({}, { message: i18nValidationMessage('user.EMAIL_INVALID') })
  @IsNotEmpty({ message: i18nValidationMessage('user.EMAIL_REQUIRED') })
  email!: string;

  @ApiProperty({ example: 'P@ssw0rd123', description: 'Strong password' })
  @IsString({ message: i18nValidationMessage('user.PASSWORD_STRING') })
  @MinLength(8, {
    message: i18nValidationMessage('user.PASSWORD_MIN_LENGTH'),
  })
  @MaxLength(64, { message: i18nValidationMessage('user.PASSWORD_TOO_LONG') })
  @Matches(/(?=.*[A-Z])/, {
    message: i18nValidationMessage('user.PASSWORD_UPPERCASE'),
  })
  @Matches(/(?=.*\d)/, {
    message: i18nValidationMessage('user.PASSWORD_NUMBER'),
  })
  @Matches(/(?=.*[!@#$%^&*(),.?":{}|<>])/, {
    message: i18nValidationMessage('user.PASSWORD_SPECIAL_CHAR'),
  })
  password!: string;

  @ApiProperty({
    example: '+201012345678',
    description: 'Egyptian phone number',
  })
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty({ message: i18nValidationMessage('user.PHONE_REQUIRED') })
  @IsPhoneNumber('EG', {
    message: i18nValidationMessage('user.PHONE_INVALID'),
  })
  phoneNumber!: string;
}
