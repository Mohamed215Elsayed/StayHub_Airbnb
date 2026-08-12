import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class RefreshTokenDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Refresh token issued during login',
  })
  @IsString({
    message: i18nValidationMessage('auth.REFRESH_TOKEN_STRING'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage('auth.REFRESH_TOKEN_REQUIRED'),
  })
  @MinLength(10, {
    message: i18nValidationMessage('auth.REFRESH_TOKEN_MIN_LENGTH'),
  })
  refreshToken!: string;
}
