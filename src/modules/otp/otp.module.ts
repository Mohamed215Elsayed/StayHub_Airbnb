import { Module } from '@nestjs/common';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ModelNames } from '@common/data-access';
import { OtpSchema } from './schemas/otp.schema';
import { OtpRepository } from './repositories/otp.respository';
import { SendOtpUseCase } from './usecases/send-otp.usecase';
import { VerifyOtpUseCase } from './usecases/verify-otp.usecase';
import { MailModule } from '@modules/mail/mail.module';
import { UsersModule } from '@modules/users/users.module';
import { FindOtpRawUsecase } from './usecases/find-otp-raw.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ModelNames.OTP, schema: OtpSchema }]),
    MailModule,
    UsersModule,
  ],
  providers: [
    OtpRepository,
    OtpService,
    SendOtpUseCase,
    VerifyOtpUseCase,
    FindOtpRawUsecase,
  ],
  controllers: [OtpController],
  exports: [OtpService],
})
export class OtpModule {}
