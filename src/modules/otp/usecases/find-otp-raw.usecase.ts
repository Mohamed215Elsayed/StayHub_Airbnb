import { Injectable } from "@nestjs/common";
import { OtpRepository } from "../repositories/otp.respository";
import { QueryFilter } from "mongoose";
import { Otp } from "../schemas/otp.schema";
import { OtpRawResponseDto } from "../dtos/otp-raw-response.dto";
import { plainToInstance } from "class-transformer";

@Injectable()
export class FindOtpRawUsecase {
    constructor(private readonly otpRepository: OtpRepository) { }

    async execute(query: QueryFilter<Otp>): Promise<OtpRawResponseDto | null> {
        const otp = await this.otpRepository.findOne(query);
        return otp ? plainToInstance(OtpRawResponseDto, otp) : null;
    }

}