import { Injectable } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { TokenService } from './tokens/token.service';
import { AuthResponse } from './interfaces/auth.interface';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterUseCase } from './use-cases/register.usecase';
import { LoginUseCase } from './use-cases/login.usecase';
import { RefreshTokenUseCase } from './use-cases/refresh-token.usecase';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  async register(
    registerAuthDto: RegisterAuthDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthResponse> {
    return this.registerUseCase.execute(registerAuthDto, ipAddress, userAgent);
  }

  async login(
    loginAuthDto: LoginAuthDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthResponse> {
    return this.loginUseCase.execute(loginAuthDto, ipAddress, userAgent);
  }

  async refresh(
    refreshToken: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.refreshTokenUseCase.execute(refreshToken, ipAddress, userAgent);
  }

  async logout(userId: string): Promise<void> {
    await this.tokenService.revokeAllUserTokens(userId);
  }
}
