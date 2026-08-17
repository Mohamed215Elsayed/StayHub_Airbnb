import { Injectable } from '@nestjs/common';
import { LoginAuthDto } from '../dto/login-auth.dto';
import { CustomUnauthorizedException } from '@common/error-handling/custom-exceptions/unauthorized.exception';
import { verify } from '@common/utils/hash.util';
import { UsersService } from '@modules/users/users.service';
import { GenerateTokensAndSaveUseCase } from './generateTokensAndSave.usecase';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly usersService: UsersService,
    private readonly generateTokensAndSaveUseCase: GenerateTokensAndSaveUseCase,
  ) {}
  async execute(
    loginAuthDto: LoginAuthDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthResponseDto> {
    const { email, password } = loginAuthDto;

    const user = await this.usersService.findOne(
      { email },
      { includePassword: true },
    );

    if (!user || !(await verify(user.password, password))) {
      throw new CustomUnauthorizedException('error.INVALID_CREDENTIALS');
    }

    const tokens = await this.generateTokensAndSaveUseCase.execute(
      user._id.toString(),
      user.email,
      ipAddress,
      userAgent,
    );
    return plainToInstance(AuthResponseDto, {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      ...tokens,
    });
  }
}
