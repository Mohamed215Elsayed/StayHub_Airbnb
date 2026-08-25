import { Injectable, Logger } from "@nestjs/common";
import { ForgetPasswordRepository } from "../repositories/forget-password.repository";
import { ResetPasswordDto } from "../dtos/reset-password.dto";

@Injectable()
export class ResetPasswordUseCase {
    private logger = new Logger(ResetPasswordUseCase.name);
    
    constructor(private readonly forgetPasswordRepository: ForgetPasswordRepository,) { }

    async execute(body: ResetPasswordDto): Promise<void> { }
}