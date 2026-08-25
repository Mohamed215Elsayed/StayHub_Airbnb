import { Injectable } from '@nestjs/common';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { SendOtpUseCase } from './usecases/send-otp.usecase';
import { VerifyOtpUseCase } from './usecases/verify-otp.usecase';
import { FindOtpRawUsecase } from './usecases/find-otp-raw.usecase';
import { OtpRepository } from './repositories/otp.respository';
import { QueryFilter } from 'mongoose';
import { Otp } from './schemas/otp.schema';
import { OtpRawResponseDto } from './dtos/otp-raw-response.dto';

@Injectable()
export class OtpService {
    constructor(
        private readonly sendOtpUseCase: SendOtpUseCase,
        private readonly verifyOtpUseCase: VerifyOtpUseCase,
        private readonly findOtpRawUsecase: FindOtpRawUsecase,
        private readonly otpRepository: OtpRepository,
    ) { }

    async sendOtp(email: string): Promise<void> {
        await this.sendOtpUseCase.execute(email);
    }

    async verifyOtp(body: VerifyOtpDto): Promise<void> {
        await this.verifyOtpUseCase.execute(body);
    }

    async findOtpRaw(query: QueryFilter<Otp>): Promise<OtpRawResponseDto | null> {
        return this.findOtpRawUsecase.execute(query);
    }

    async deleteOtp(query: QueryFilter<Otp>): Promise<void> {
        await this.otpRepository.findOneAndDelete(query);
    }
}
