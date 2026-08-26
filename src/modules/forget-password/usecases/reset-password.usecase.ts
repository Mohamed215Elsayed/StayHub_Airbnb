import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ForgetPasswordRepository } from '../repositories/forget-password.repository';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { hash } from '@common/utils/hash.util';
import { CustomBadRequestException } from '@common/error-handling/custom-exceptions/bad-request.exception';
import { FindForgetPasswordRawUsecase } from './find-forget-password-raw.usecase';
import { UsersService } from '@modules/users/users.service';

@Injectable()
export class ResetPasswordUseCase {
  private logger = new Logger(ResetPasswordUseCase.name);

  constructor(
    @InjectConnection()
    private readonly connection: Connection,
    private readonly forgetPasswordRepository: ForgetPasswordRepository,
    private readonly usersService: UsersService,
    private readonly findForgetPasswordRawUsecase: FindForgetPasswordRawUsecase,
  ) {}

  async execute(body: ResetPasswordDto): Promise<void> {
    const record = await this.findForgetPasswordRawUsecase.execute({
      email: body.email,
    });

    if (!record) {
      throw new CustomBadRequestException('forgetPassword.OTP_NOT_FOUND');
    }
    if (!record.isVerified) {
      throw new CustomBadRequestException('forgetPassword.OTP_NOT_VERIFIED');
    }
    if (new Date() > record.expiresAt) {
      throw new CustomBadRequestException('forgetPassword.OTP_EXPIRED');
    }

    const passwordHash = await hash(body.newPassword);

    const session = await this.connection.startSession();

    try {
      await session.withTransaction(async () => {
        const user = await this.usersService.updateUserRaw(
          { email: body.email },
          { password: passwordHash },
          session,
        );

        if (!user) {
          throw new CustomBadRequestException('user.NOT_FOUND');
        }

        await this.forgetPasswordRepository.findOneAndDelete(
          { email: body.email },
          { session },
        );
      });
    } catch (e) {
      await session.abortTransaction();
      this.logger.error('Failed to reset password', e);
      throw new CustomBadRequestException(
        'forgetPassword.PASSWORD_RESET_FAILED',
      );
    } finally {
      await session.endSession();
    }
  }
}
