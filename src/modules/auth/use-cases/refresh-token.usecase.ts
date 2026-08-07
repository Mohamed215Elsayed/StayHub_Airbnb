import { Injectable } from "@nestjs/common";
import { TokenService } from "../tokens/token.service";
import { UsersService } from "@modules/users/users.service";
import { CustomUnauthorizedException } from "@common/error-handling/custom-exceptions/unauthorized.exception";
import { GenerateTokensAndSaveUseCase } from "./generateTokensAndSave.usecase";

@Injectable()
export class RefreshTokenUseCase { 
    constructor(
        private readonly usersService: UsersService,
        private readonly tokenService: TokenService,
        private readonly generateTokensAndSaveUseCase: GenerateTokensAndSaveUseCase,
    ) { }
    async execute(
        refreshToken: string,
        ipAddress?: string,
        userAgent?: string,
      ): Promise<{ accessToken: string; refreshToken: string }> {
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
    
        const user = await this.usersService.findOne(
          { _id: payload.sub },
          { includePassword: false },
        );
    
        if (!user) {
          throw new CustomUnauthorizedException('error.INVALID_REFRESH_TOKEN');
        }
    
        await this.tokenService.revokeRefreshToken(matchedToken.tokenId);
    
        return this.generateTokensAndSaveUseCase.execute(
          user._id.toString(),
          user.email,
          ipAddress,
          userAgent,
        );
      }
}