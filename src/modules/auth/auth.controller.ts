import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  Ip,
  Headers,
  Logger,
  Get,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { MeResponseDto } from './dto/me-response.dto';
import type { AuthTokens } from './interfaces/auth.interface';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { parseDurationToMs } from '@common/utils/parse-duration';
import { ApiTags } from '@nestjs/swagger';
import { CustomI18nService } from '@i18n/custom-i18n.service';
import {
  RegisterSwagger,
  LoginSwagger,
  RefreshTokenSwagger,
  LogoutSwagger,
  MeSwagger,
} from './swagger';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '@common/configuration/environment.interface';
import { API_TAGS } from '@common/swagger';
import { Public } from './decorators/public.decorator';
import {
  CurrentAccount,
  Principal,
} from './decorators/current-account.decorator';

@ApiTags(API_TAGS.AUTH)
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService,
    private readonly customI18nService: CustomI18nService,
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {}

  @Public()
  @Post('/register')
  @RegisterSwagger
  async register(
    @Body() registerAuthDto: RegisterAuthDto,
    @Ip() ip: string,
    @Res({ passthrough: true }) res: Response,
    @Headers('user-agent') userAgent?: string,
  ): Promise<AuthResponseDto> {
    const result = await this.authService.register(
      registerAuthDto,
      ip,
      userAgent,
    );
    this.setRefreshTokenCookie(res, result.refreshToken);
    return result;
  }

  @Public()
  @Post('/login')
  @LoginSwagger
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginAuthDto: LoginAuthDto,
    @Ip() ip: string,
    @Res({ passthrough: true }) res: Response,
    @Headers('user-agent') userAgent?: string,
  ): Promise<AuthResponseDto> {
    const result = await this.authService.login(loginAuthDto, ip, userAgent);
    this.setRefreshTokenCookie(res, result.refreshToken);
    return result;
  }

  @Public()
  @Post('/refresh')
  @RefreshTokenSwagger
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Ip() ip: string,
    @Res({ passthrough: true }) res: Response,
    @Headers('user-agent') userAgent?: string,
  ): Promise<AuthTokens> {
    const tokens = await this.authService.refresh(
      refreshTokenDto.refreshToken,
      ip,
      userAgent,
    );
    this.setRefreshTokenCookie(res, tokens.refreshToken);
    return tokens;
  }

  @Get('me')
  @MeSwagger
  getMe(@CurrentAccount() principal: Principal): MeResponseDto {
    return principal;
  }

  @Post('/logout')
  @LogoutSwagger
  async logout(
    @CurrentAccount() principal: Principal,
    @Req() req: Request,
  ): Promise<{ message: string }> {
    const userId = principal.user._id;
    const ip = (req as any).ip ?? 'unknown';
    const userAgent = req.headers['user-agent'] ?? 'unknown';
    await this.authService.logout(userId, ip, userAgent);
    return { message: this.customI18nService.translate('auth.LOGOUT_SUCCESS') };
  }

  private setRefreshTokenCookie(res: Response, refreshToken: string): void {
    const maxAge = parseDurationToMs(
      this.configService.getOrThrow('REFRESH_TOKEN_EXPIRE_IN'),
    );
    const isProd = this.configService.get('NODE_ENV') === 'production';
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge,
      path: '/auth',
    });
  }
}
