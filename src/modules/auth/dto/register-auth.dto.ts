import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsPhoneNumber,
  //   IsStrongPassword,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

export class RegisterAuthDto {
  @ApiProperty({
    example: 'Ahmed Hassan',
    description: 'Full name of the user',
  })
  @Transform(({ value }) => value?.trim())
  @IsString({ message: i18nValidationMessage('auth.NAME_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('auth.NAME_REQUIRED') })
  @MinLength(2, { message: i18nValidationMessage('auth.NAME_MIN_LENGTH') })
  @MaxLength(100, { message: i18nValidationMessage('auth.NAME_MAX_LENGTH') })
  name!: string;

  @ApiProperty({
    example: 'ahmed@example.com',
    description: 'User email address',
  })
  @Transform(({ value }) => value?.trim().toLowerCase())
  // @IsEmail({}, { message: 'Email must be a valid email address' })
  @MinLength(2, {
    message: i18nValidationMessage('auth.EMAIL_INVALID'),
  })
  @IsEmail({}, { message: i18nValidationMessage('auth.EMAIL_INVALID') })
  @IsNotEmpty({ message: i18nValidationMessage('auth.EMAIL_REQUIRED') })
  email!: string;

  @ApiProperty({
    example: 'P@ssw0rd123',
    description:
      'Strong password (8-64 chars, 1 uppercase, 1 number, 1 special char)',
  })
  @IsString()
  @MinLength(8, { message: i18nValidationMessage('auth.PASSWORD_MIN_LENGTH') })
  @MaxLength(64, { message: i18nValidationMessage('auth.PASSWORD_TOO_LONG') })
  @Matches(/(?=.*[A-Z])/, {
    message: i18nValidationMessage('auth.PASSWORD_UPPERCASE'),
  })
  @Matches(/(?=.*\d)/, {
    message: i18nValidationMessage('auth.PASSWORD_NUMBER'),
  })
  @Matches(/(?=.*[!@#$%^&*(),.?":{}|<>])/, {
    message: i18nValidationMessage('auth.PASSWORD_SPECIAL_CHAR'),
  })
  password!: string;

  @ApiProperty({
    example: '+201012345678',
    description: 'Valid Egyptian phone number',
  })
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty({ message: i18nValidationMessage('auth.PHONE_REQUIRED') })
  @IsPhoneNumber('EG', {
    message: i18nValidationMessage('auth.PHONE_INVALID'),
  })
  //Trade-off-I use (libphonenumber-js) to validate the phone number format, but it may not cover all possible valid formats. You can adjust the validation logic based on your specific requirements.
  //   @Matches(/^\+?[0-9]{10,15}$/, { message: 'Phone number must be valid' })
  phoneNumber!: string;
}
