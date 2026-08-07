import { Injectable } from "@nestjs/common";
import { TokenService } from "../tokens/token.service";
import { JwtPayload } from "../interfaces/auth.interface";

@Injectable()
export class GenerateTokensAndSaveUseCase {
    constructor(private readonly tokenService: TokenService) { }
    async execute(
        userId: string,
        email: string,
        ipAddress?: string,
        userAgent?: string,
    ): Promise<{ accessToken: string; refreshToken: string }> {
        const payload: JwtPayload = { sub: userId, email };
        const accessToken = this.tokenService.generateAccessToken(payload);
        const refreshToken = this.tokenService.generateRefreshToken(payload);
        await this.tokenService.saveRefreshToken(userId, refreshToken, ipAddress, userAgent);
        return { accessToken, refreshToken };
    }
}