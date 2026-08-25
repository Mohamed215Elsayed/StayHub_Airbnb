import { Injectable } from "@nestjs/common";
import { ForgetPasswordRepository } from "../repositories/forget-password.repository";
import { VerifyForgetPasswordOtpDto } from "../dtos/verify-forget-password-otp.dto";

@Injectable()
export class VerifyForgetPasswordOtpUseCase {
    constructor(
        private readonly forgetPasswordRepository: ForgetPasswordRepository,
    ) { }

    async execute(body: VerifyForgetPasswordOtpDto): Promise<void> { }
}