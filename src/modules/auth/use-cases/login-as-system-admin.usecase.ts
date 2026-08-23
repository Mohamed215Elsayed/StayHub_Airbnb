import { Injectable, Logger } from '@nestjs/common';
import { SystemAdminRepository } from '@modules/system-admins/repository/system-admin.repository';
import { CustomUnauthorizedException } from '@common/error-handling/custom-exceptions/unauthorized.exception';
import { verify } from '@common/utils/hash.util';
import { GenerateTokensAndSaveUsecase } from './generateTokensAndSave.usecase';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { plainToInstance } from 'class-transformer';
import { LoginAuthDto } from '../dto/login-auth.dto';
import { Roles } from '@common/constants';

@Injectable()
export class LoginAsSystemAdminUsecase {
  private readonly logger = new Logger(LoginAsSystemAdminUsecase.name);

  constructor(
    private readonly systemAdminRepository: SystemAdminRepository,
    private readonly generateTokensAndSaveUsecase: GenerateTokensAndSaveUsecase,
  ) {}

  async execute(
    loginAuthDto: LoginAuthDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthResponseDto> {
    const { email, password } = loginAuthDto;
    const admin = await this.systemAdminRepository.findOne(
      { email, isDeleted: false },
      { lean: false },
      undefined,
    );

    if (!admin || !(await verify(admin.password, password))) {
      throw new CustomUnauthorizedException('error.INVALID_CREDENTIALS');
    }

    const tokens = await this.generateTokensAndSaveUsecase.execute(
      admin._id.toString(),
      admin.email,
      Roles.SYSTEM_ADMIN,
      ipAddress,
      userAgent,
    );

    return plainToInstance(
      AuthResponseDto,
      {
        user: {
          id: admin._id.toString(),
          name: admin.name,
          email: admin.email,
          role: Roles.SYSTEM_ADMIN,
          createdAt: admin.createdAt,
          updatedAt: admin.updatedAt,
        },
        ...tokens,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
