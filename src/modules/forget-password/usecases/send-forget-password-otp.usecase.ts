import { Injectable } from '@nestjs/common';
import { ForgetPasswordRepository } from '../repositories/forget-password.repository';
import { UsersService } from '@modules/users/users.service';
import { MailService } from '@modules/mail/mail.service';
import { MailTemplate } from '@modules/mail/enums/mail-template.enum';
import { CustomNotFoundException } from '@common/error-handling/custom-exceptions/not-found.exception';

const OTP_EXPIRY_MINUTES = 10;

@Injectable()
export class SendForgetPasswordOtpUseCase {
  constructor(
    private readonly forgetPasswordRepository: ForgetPasswordRepository,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  private generateOtp(): string {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  async execute(email: string): Promise<void> {
    const existingUser = await this.usersService.findOne({ email });
    if (!existingUser) {
      throw new CustomNotFoundException('error.USER_NOT_FOUND');
    }

    const code = this.generateOtp();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + OTP_EXPIRY_MINUTES);

    await this.forgetPasswordRepository.findOneAndUpdate(
      { email },
      { code, expiresAt, isVerified: false },
      { upsert: true },
    );

    await this.mailService.sendTemplatedEmail({
      to: email,
      template: MailTemplate.OTP,
      context: {
        otp: code,
        expirationMinutes: OTP_EXPIRY_MINUTES,
      },
    });
  }
}
