import { Injectable } from '@nestjs/common';
import { TokenService } from '../tokens/token.service';
import { JwtPayload } from '../interfaces/auth.interface';
import { Roles } from '@common/constants';

@Injectable()
export class GenerateTokensAndSaveUsecase {
  constructor(private readonly tokenService: TokenService) {}
  async execute(
    userId: string,
    email: string,
    role: Roles,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JwtPayload = { sub: userId, email, role };
    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);
    await this.tokenService.saveRefreshToken(
      userId,
      refreshToken,
      ipAddress,
      userAgent,
    );
    return { accessToken, refreshToken };
  }
}
