import { Injectable, Logger } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { AuthTokens } from './interfaces/auth.interface';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterUsecase } from './use-cases/register.usecase';
import { LoginUsecase } from './use-cases/login.usecase';
import { RefreshTokenUsecase } from './use-cases/refresh-token.usecase';
import { LogoutUseCase } from './use-cases/logout.usecase';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly registerUsecase: RegisterUsecase,
    private readonly loginUsecase: LoginUsecase,
    private readonly refreshTokenUsecase: RefreshTokenUsecase,
    private readonly logoutUseCase: LogoutUseCase,
  ) {}

  async register(
    registerAuthDto: RegisterAuthDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthResponseDto> {
    this.logger.log(`Register attempt for email: ${registerAuthDto.email}`);
    const result = await this.registerUsecase.execute(
      registerAuthDto,
      ipAddress,
      userAgent,
    );
    this.logger.log(`User registered successfully: ${result.user.id}`);
    return result;
  }

  async login(
    loginAuthDto: LoginAuthDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthResponseDto> {
    this.logger.log(`Login attempt for email: ${loginAuthDto.email}`);
    const result = await this.loginUsecase.execute(
      loginAuthDto,
      ipAddress,
      userAgent,
    );
    this.logger.log(`User logged in successfully: ${result.user.id}`);
    return result;
  }

  async refresh(
    refreshToken: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthTokens> {
    this.logger.log('Refresh token attempt');
    const tokens = await this.refreshTokenUsecase.execute(
      refreshToken,
      ipAddress,
      userAgent,
    );
    this.logger.log('Tokens refreshed successfully');
    return tokens;
  }

  async logout(
    userId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    this.logger.log(`Logout attempt for user: ${userId}`);
    await this.logoutUseCase.execute(userId, ipAddress, userAgent);
    this.logger.log(`User logged out successfully: ${userId}`);
  }
}
