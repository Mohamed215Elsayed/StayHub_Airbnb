import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendEmailDto {
  @ApiProperty({
    name: 'to',
    description: 'Recipient email address',
    example: 'user@example.com',
  })
  @IsEmail()
  to!: string;

  @ApiProperty({
    name: 'subject',
    description: 'The subject line of the email',
    example: 'Welcome to StayHub',
  })
  @IsString()
  subject!: string;

  @ApiProperty({
    name: 'text',
    description: 'Plain text content of the email body',
    example: 'Welcome to StayHub. Thanks for joining us!',
    required: false,
  })
  @IsOptional()
  @IsString()
  text?: string;

  @ApiProperty({
    name: 'html',
    description: 'HTML content of the email body',
    example: '<p>Welcome to <b>StayHub</b>.</p>',
    required: false,
  })
  @IsOptional()
  @IsString()
  html?: string;

  @ApiProperty({
    name: 'from',
    description: 'Optional override of the default sender address',
    example: '"StayHub" <no-reply@stayhub.com>',
    required: false,
  })
  @IsOptional()
  @IsString()
  from?: string;
}
