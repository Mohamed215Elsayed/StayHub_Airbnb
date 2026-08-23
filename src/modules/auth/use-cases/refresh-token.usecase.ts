import { Injectable } from '@nestjs/common';
import { TokenService } from '../tokens/token.service';
import { UsersService } from '@modules/users/users.service';
import { CustomUnauthorizedException } from '@common/error-handling/custom-exceptions/unauthorized.exception';
import { GenerateTokensAndSaveUsecase } from './generateTokensAndSave.usecase';
import { AuthTokens } from '../interfaces/auth.interface';
import { Types } from 'mongoose';

@Injectable()
export class RefreshTokenUsecase {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly generateTokensAndSaveUsecase: GenerateTokensAndSaveUsecase,
  ) {}
  async execute(
    refreshToken: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthTokens> {
    const payload = this.tokenService.verifyToken(refreshToken);

    if (payload.type !== 'refresh') {
      throw new CustomUnauthorizedException('error.INVALID_REFRESH_TOKEN');
    }

    const matchedToken = await this.tokenService.verifyRefreshToken(
      payload.sub,
      refreshToken,
    );

    if (!matchedToken) {
      throw new CustomUnauthorizedException('error.INVALID_REFRESH_TOKEN');
    }

    const user = await this.usersService.findOne({
      _id: new Types.ObjectId(payload.sub),
    });

    if (!user) {
      throw new CustomUnauthorizedException('error.INVALID_REFRESH_TOKEN');
    }

    await this.tokenService.revokeRefreshToken(matchedToken.tokenId);

    return this.generateTokensAndSaveUsecase.execute(
      user.id,
      user.email,
      payload.role,
      ipAddress,
      userAgent,
    );
  }
}
