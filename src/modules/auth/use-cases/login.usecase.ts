import { Injectable } from '@nestjs/common';
import { LoginAuthDto } from '../dto/login-auth.dto';
import { SerializedUser } from '@modules/users/schemas/user.schema';
import { CustomUnauthorizedException } from '@common/error-handling/custom-exceptions/unauthorized.exception';
import * as argon2 from 'argon2';
import { UsersService } from '@modules/users/users.service';
import { GenerateTokensAndSaveUseCase } from './generateTokensAndSave.usecase';

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
  ) {
    const { email, password } = loginAuthDto;

    const user = await this.usersService.findOne(
      { email },
      { includePassword: true },
    );

    if (!user || !(await argon2.verify(user.password, password))) {
      throw new CustomUnauthorizedException('error.INVALID_CREDENTIALS');
    }

    const tokens = await this.generateTokensAndSaveUseCase.execute(
      user._id.toString(),
      user.email,
      ipAddress,
      userAgent,
    );
    return {
      user: user.toJSON() as SerializedUser,
      ...tokens,
    };
  }
}
