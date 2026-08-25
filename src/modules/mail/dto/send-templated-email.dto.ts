import { IsEmail, IsEnum, IsObject, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MailTemplate } from '../enums/mail-template.enum';

export class SendTemplatedEmailDto {
  @ApiProperty({
    name: 'to',
    description: 'Recipient email address',
    example: 'user@example.com',
  })
  @IsEmail()
  to!: string;

  @ApiProperty({
    name: 'template',
    description: 'The email template to render',
    enum: MailTemplate,
    example: MailTemplate.OTP,
  })
  @IsEnum(MailTemplate)
  template!: MailTemplate;

  @ApiProperty({
    name: 'context',
    description:
      'Dynamic data used to render the template placeholders (e.g. otp, firstName, propertyTitle)',
    example: { otp: '123456', expirationMinutes: 10 },
    type: 'object',
    additionalProperties: true,
  })
  @IsObject()
  context!: Record<string, unknown>;
}
