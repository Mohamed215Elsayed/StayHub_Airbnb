import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  Req,
  UseGuards,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import * as process from 'process';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { AuthTokens } from './interfaces/auth.interface';
import { ResponseInterceptor } from './interceptors/auth.interceptor';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { parseDurationToMs } from '@common/utils/parse-duration';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseInterceptors(ResponseInterceptor)
  @Post('/register')
  async register(
    @Body() registerAuthDto: RegisterAuthDto,
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const result = await this.authService.register(
      registerAuthDto,
      req.ip,
      req.headers['user-agent'],
    );
    this.setRefreshTokenCookie(res, result.refreshToken);
    return result;
  }

  @UseInterceptors(ResponseInterceptor)
  @Post('/login')
  async login(
    @Body() loginAuthDto: LoginAuthDto,
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const result = await this.authService.login(
      loginAuthDto,
      req.ip,
      req.headers['user-agent'],
    );
    this.setRefreshTokenCookie(res, result.refreshToken);
    return result;
  }

  @UseInterceptors(ResponseInterceptor)
  @Post('/refresh')
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthTokens> {
    const tokens = await this.authService.refresh(
      refreshTokenDto.refreshToken,
      req.ip,
      req.headers['user-agent'],
    );
    this.setRefreshTokenCookie(res, tokens.refreshToken);
    return tokens;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  async logout(@Req() req: any): Promise<{ message: string }> {
    const userId = req.user.sub;
    await this.authService.logout(userId);
    return { message: 'Logged out successfully' };
  }

  private setRefreshTokenCookie(res: Response, refreshToken: string): void {
    const maxAge = parseDurationToMs(
      process.env.REFRESH_TOKEN_EXPIRE_IN || '30d',
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie(XSS protection)
      secure: true, // Ensures the cookie is only sent over HTTPS
      sameSite: 'lax', // Helps mitigate CSRF attacks by controlling cross-site cookie sending
      maxAge, // Cookie expiration time in milliseconds
      path: '/auth', // Cookie is only sent for requests to /auth endpoints
    });
  }
}
