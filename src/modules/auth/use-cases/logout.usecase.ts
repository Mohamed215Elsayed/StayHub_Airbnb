import { Injectable } from '@nestjs/common';
import { TokenService } from '../tokens/token.service';

@Injectable()
export class LogoutUseCase {
  constructor(private readonly tokenService: TokenService) {}

  async execute(userId: string): Promise<void> {
    await this.tokenService.revokeAllUserTokens(userId);
  }
}
