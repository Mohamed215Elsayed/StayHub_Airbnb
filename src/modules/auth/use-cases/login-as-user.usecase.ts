import { Injectable, Logger } from '@nestjs/common';
import { Roles } from '@common/constants';
import { LoginAuthDto } from '../dto/login-auth.dto';
import { CustomUnauthorizedException } from '@common/error-handling/custom-exceptions/unauthorized.exception';
import { verify } from '@common/utils/hash.util';
import { UsersService } from '@modules/users/users.service';
import { UserRepository } from '@modules/users/repository/user.repository';
import { GenerateTokensAndSaveUsecase } from './generateTokensAndSave.usecase';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class LoginAsUserUsecase {
  private readonly logger = new Logger(LoginAsUserUsecase.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly userRepository: UserRepository,
    private readonly generateTokensAndSaveUsecase: GenerateTokensAndSaveUsecase,
  ) {}
  async execute(
    loginAuthDto: LoginAuthDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthResponseDto> {
    const { email, password } = loginAuthDto;
    const user = await this.userRepository.findOne(
      { email, isDeleted: false },
      undefined,
      undefined,
    );

    if (!user || !(await verify(user.password, password))) {
      throw new CustomUnauthorizedException('error.INVALID_CREDENTIALS');
    }

    const tokens = await this.generateTokensAndSaveUsecase.execute(
      user._id.toString(),
      user.email,
      Roles.USER,
      ipAddress,
      userAgent,
    );

    return plainToInstance(
      AuthResponseDto,
      {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: Roles.USER,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        ...tokens,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
