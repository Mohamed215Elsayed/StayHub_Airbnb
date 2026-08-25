import { Injectable } from "@nestjs/common";
import { ForgetPasswordRepository } from "../repositories/forget-password.repository";
import { UsersService } from "@modules/users/users.service";
import { MailService } from "@modules/mail/mail.service";


@Injectable()
export class SendForgetPasswordOtpUseCase {
    constructor(
        private readonly forgetPasswordRepository: ForgetPasswordRepository,
        private readonly usersService: UsersService,
        private readonly mailService: MailService,
    ) { }

    async execute(email: string): Promise<void> {

    }
}