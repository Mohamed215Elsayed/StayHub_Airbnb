import { Injectable } from '@nestjs/common';
import { OtpRepository } from '../repositories/otp.respository';
import { MailService } from '@modules/mail/mail.service';
import { MailTemplate } from '@modules/mail/enums/mail-template.enum';
import { UsersService } from '@modules/users/users.service';
import { CustomBadRequestException } from '@common/error-handling/custom-exceptions/bad-request.exception';

const OTP_EXPIRY_MINUTES = 10;

@Injectable()
export class SendOtpUseCase {
  constructor(
    private readonly otpRepository: OtpRepository,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  private async validateBeforeSendOtp(email: string) {
    const otpExistenceAndVerified = await this.otpRepository.findOne({
      email,
      isVerified: true,
    });

    if (otpExistenceAndVerified) {
      const existingUser = await this.usersService.findOne({ email });
      if (existingUser)
        throw new CustomBadRequestException('otp.EMAIL_ALREADY_VERIFIED');
    }
  }

  private generateOtp(): string {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  async execute(email: string): Promise<void> {
    await this.validateBeforeSendOtp(email);
    const code = this.generateOtp();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + OTP_EXPIRY_MINUTES);
    await this.otpRepository.findOneAndUpdate(
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
