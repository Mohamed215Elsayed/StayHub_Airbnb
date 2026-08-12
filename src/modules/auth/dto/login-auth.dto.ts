import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

export class LoginAuthDto {
  @Transform(({ value }) => value?.trim().toLowerCase())
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail({}, { message: i18nValidationMessage('auth.EMAIL_INVALID') })
  @IsNotEmpty({ message: i18nValidationMessage('auth.EMAIL_REQUIRED') })
  email!: string;

  @ApiProperty({ example: 'P@ssw0rd123', description: 'User password' })
  @IsString({ message: i18nValidationMessage('auth.PASSWORD_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('auth.PASSWORD_REQUIRED') })
  @MaxLength(72, { message: i18nValidationMessage('auth.PASSWORD_TOO_LONG') })
  password!: string;
}
