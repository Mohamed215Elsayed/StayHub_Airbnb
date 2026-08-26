import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { ApiTags } from '@nestjs/swagger';
import { API_TAGS } from '@common/swagger';
import { SendEmailDto } from './dto/send-email.dto';
import { SendTemplatedEmailDto } from './dto/send-templated-email.dto';
import { Public } from '@modules/auth/decorators/public.decorator';
import { SendEmailSwagger, SendTemplatedEmailSwagger } from './swagger';

@ApiTags(API_TAGS.MAIL)
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @SendEmailSwagger()
  @Public()
  @Post('/send')
  async sendEmail(@Body() dto: SendEmailDto): Promise<void> {
    await this.mailService.sendEmail(dto);
  }

  @SendTemplatedEmailSwagger()
  @Public()
  @Post('/send-template')
  async sendTemplatedEmail(@Body() dto: SendTemplatedEmailDto): Promise<void> {
    await this.mailService.sendTemplatedEmail(dto);
  }
}
