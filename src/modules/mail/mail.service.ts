import { Inject, Injectable, Logger } from '@nestjs/common';
import { SendEmailDto } from './dto/send-email.dto';
import { SendTemplatedEmailDto } from './dto/send-templated-email.dto';
import type { EmailAdapterInterface } from './interfaces/email-adapter.interface';
import { EMAIL_ADAPTER } from './constants/mail.constant';
import { MailTemplateService } from './templates/mail-template.service';
import { CustomBadRequestException } from '@common/error-handling/custom-exceptions/bad-request.exception';

@Injectable()
export class MailService {
  private logger = new Logger(MailService.name);

  constructor(
    @Inject(EMAIL_ADAPTER)
    private readonly emailAdapter: EmailAdapterInterface,
    private readonly templateService: MailTemplateService,
  ) {}

  async sendEmail(dto: SendEmailDto): Promise<void> {
    try {
      await this.emailAdapter.sendEmail(dto);
    } catch (e) {
      this.logger.error('Failed to send email', e);
      throw new CustomBadRequestException('mail.EMAIL_SEND_FAILED');
    }
  }

  async sendTemplatedEmail(dto: SendTemplatedEmailDto): Promise<void> {
    const { subject, html, text } = this.templateService.render(
      dto.template,
      dto.context,
    );

    await this.sendEmail({ to: dto.to, subject, html, text });
  }
}
