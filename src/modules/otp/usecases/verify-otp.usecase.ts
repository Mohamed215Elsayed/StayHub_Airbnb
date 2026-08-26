import { Injectable } from '@nestjs/common';
import { OtpRepository } from '../repositories/otp.respository';
import { VerifyOtpDto } from '../dtos/verify-otp.dto';
import { CustomBadRequestException } from '@common/error-handling/custom-exceptions/bad-request.exception';
import { OtpRawResponseDto } from '../dtos/otp-raw-response.dto';
import { FindOtpRawUsecase } from './find-otp-raw.usecase';

@Injectable()
export class VerifyOtpUseCase {
  constructor(
    private readonly otpRepository: OtpRepository,
    private readonly findOtpRawUsecase: FindOtpRawUsecase,
  ) {}
  async execute(body: VerifyOtpDto): Promise<void> {
    // 1) find otp by email
    const otp = await this.findOtpRawUsecase.execute({ email: body.email });

    this.validateOtpBeforeVerify(otp, body);

    await this.otpRepository.findOneAndUpdate(
      { email: body.email },
      { isVerified: true },
    );
  }

  private validateOtpBeforeVerify(
    otp: OtpRawResponseDto | null,
    body: VerifyOtpDto,
  ) {
    if (!otp) throw new CustomBadRequestException('otp.OTP_NOT_FOUND');
    if (otp.code !== body.code)
      throw new CustomBadRequestException('otp.INVALID_OTP');
    if (new Date() > otp.expiresAt)
      throw new CustomBadRequestException('otp.OTP_EXPIRED');
    if (otp.isVerified)
      throw new CustomBadRequestException('otp.OTP_ALREADY_VERIFIED');
  }
}
