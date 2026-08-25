import { Injectable } from "@nestjs/common";
import { ForgetPasswordRepository } from "../repositories/forget-password.repository";


@Injectable()
export class SendForgetPasswordOtpUseCase {
    constructor(
        private readonly forgetPasswordRepository: ForgetPasswordRepository,) { }

    async execute(email: string): Promise<void> {
        
     }
}