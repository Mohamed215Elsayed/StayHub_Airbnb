import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailTemplateService } from './templates/mail-template.service';

import { NodemailerEmailAdapter } from './adapters/nodemailer-email.adapter';
import { EMAIL_ADAPTER } from './constants/mail.constant';

@Module({
  controllers: [MailController],
  providers: [
    MailService,
    MailTemplateService,
    {
      provide: EMAIL_ADAPTER,
      useClass: NodemailerEmailAdapter,
    },
  ],
  exports: [EMAIL_ADAPTER, MailService],
})
export class MailModule {}
