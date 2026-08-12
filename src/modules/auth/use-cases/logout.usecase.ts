import { Injectable, Logger } from '@nestjs/common';
import { TokenService } from '../tokens/token.service';

@Injectable()
export class LogoutUseCase {
  private readonly logger = new Logger(LogoutUseCase.name);
  constructor(private readonly tokenService: TokenService) {}

  async execute(
    userId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    this.logger.log(
      `Revoking all refresh tokens for user: ${userId} | ip: ${ipAddress ?? 'unknown'} | agent: ${userAgent ?? 'unknown'}`,
    );
    await this.tokenService.revokeAllUserTokens(userId);
  }
}
