import { Injectable } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { AuthTokens } from './interfaces/auth.interface';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterUseCase } from './use-cases/register.usecase';
import { LoginUseCase } from './use-cases/login.usecase';
import { RefreshTokenUseCase } from './use-cases/refresh-token.usecase';
import { LogoutUseCase } from './use-cases/logout.usecase';

@Injectable()
export class AuthService {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) {}

  async register(
    registerAuthDto: RegisterAuthDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthResponseDto> {
    return this.registerUseCase.execute(registerAuthDto, ipAddress, userAgent);
  }

  async login(
    loginAuthDto: LoginAuthDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthResponseDto> {
    return this.loginUseCase.execute(loginAuthDto, ipAddress, userAgent);
  }

  async refresh(
    refreshToken: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthTokens> {
    return this.refreshTokenUseCase.execute(refreshToken, ipAddress, userAgent);
  }

  async logout(userId: string): Promise<void> {
    return this.logoutUseCase.execute(userId);
  }
}
