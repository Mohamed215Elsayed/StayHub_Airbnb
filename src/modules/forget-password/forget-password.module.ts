import { Module } from '@nestjs/common';
import { ForgetPasswordController } from './forget-password.controller';
import { ForgetPasswordRepository } from './repositories/forget-password.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ModelNames } from '@common/data-access';
import { ForgetPasswordSchema } from './schemas/forget-password.schema';
import { ForgetPasswordService } from './forget-password.service';
import { SendForgetPasswordOtpUseCase } from './usecases/send-forget-password-otp.usecase';
import { VerifyForgetPasswordOtpUseCase } from './usecases/verify-forget-password-otp.usecase';
import { ResetPasswordUseCase } from './usecases/reset-password.usecase';
import { UsersModule } from '@modules/users/users.module';
import { MailModule } from '@modules/mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModelNames.FORGET_PASSWORD, schema: ForgetPasswordSchema },
    ]),
    UsersModule,
    MailModule,
  ],
  controllers: [ForgetPasswordController],
  providers: [
    ForgetPasswordRepository,
    ForgetPasswordService,
    SendForgetPasswordOtpUseCase,
    VerifyForgetPasswordOtpUseCase,
    ResetPasswordUseCase
  ],
})
export class ForgetPasswordModule { }
