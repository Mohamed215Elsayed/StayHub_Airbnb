import { Injectable } from '@nestjs/common';
import { ForgetPasswordRepository } from '../repositories/forget-password.repository';
import { VerifyForgetPasswordOtpDto } from '../dtos/verify-forget-password-otp.dto';
import { CustomBadRequestException } from '@common/error-handling/custom-exceptions/bad-request.exception';
import { FindForgetPasswordRawUsecase } from './find-forget-password-raw.usecase';

@Injectable()
export class VerifyForgetPasswordOtpUseCase {
  constructor(
    private readonly forgetPasswordRepository: ForgetPasswordRepository,
    private readonly findForgetPasswordRawUsecase: FindForgetPasswordRawUsecase,
  ) {}

  async execute(body: VerifyForgetPasswordOtpDto): Promise<void> {
    const record = await this.findForgetPasswordRawUsecase.execute({
      email: body.email,
    });

    this.validateBeforeVerify(record, body);

    await this.forgetPasswordRepository.findOneAndUpdate(
      { email: body.email },
      { isVerified: true },
    );
  }

  private validateBeforeVerify(
    record: { isVerified: boolean; code: string; expiresAt: Date } | null,
    body: VerifyForgetPasswordOtpDto,
  ) {
    if (!record)
      throw new CustomBadRequestException('forgetPassword.OTP_NOT_FOUND');
    if (record.code !== body.code)
      throw new CustomBadRequestException('forgetPassword.INVALID_OTP');
    if (new Date() > record.expiresAt)
      throw new CustomBadRequestException('forgetPassword.OTP_EXPIRED');
    if (record.isVerified)
      throw new CustomBadRequestException(
        'forgetPassword.OTP_ALREADY_VERIFIED',
      );
  }
}
