import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendForgetPasswordOtpDto {
  @ApiProperty({
    description: 'Email address that will receive the forget-password OTP',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email!: string;
}
