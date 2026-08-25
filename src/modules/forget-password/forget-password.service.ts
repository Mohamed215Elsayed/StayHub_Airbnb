import { Injectable } from '@nestjs/common';
import { SendForgetPasswordOtpUseCase } from './usecases/send-forget-password-otp.usecase';
import { VerifyForgetPasswordOtpUseCase } from './usecases/verify-forget-password-otp.usecase';
import { ResetPasswordUseCase } from './usecases/reset-password.usecase';
import { VerifyForgetPasswordOtpDto } from './dtos/verify-forget-password-otp.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Injectable()
export class ForgetPasswordService {
    constructor(
        private readonly sendForgetPasswordOtpUseCase: SendForgetPasswordOtpUseCase,
        private readonly verifyForgetPasswordOtpUseCase: VerifyForgetPasswordOtpUseCase,
        private readonly resetPasswordUseCase: ResetPasswordUseCase,
    ) { }

    async sendForgetPasswordOtp(email: string): Promise<void> {
        return this.sendForgetPasswordOtpUseCase.execute(email);
    }

    async verifyForgetPasswordOtp(
        body: VerifyForgetPasswordOtpDto,
    ): Promise<void> {
        return this.verifyForgetPasswordOtpUseCase.execute(body);
    }

    async resetPassword(body: ResetPasswordDto): Promise<void> {
        return this.resetPasswordUseCase.execute(body);
    }
}
