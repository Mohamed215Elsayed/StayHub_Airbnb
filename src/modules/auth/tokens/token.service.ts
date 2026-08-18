import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { RefreshToken } from '../schema/refresh-token.schema';
import { JwtPayload, RefreshTokenPayload } from '../interfaces/auth.interface';
import { CustomUnauthorizedException } from '@common/error-handling/custom-exceptions/unauthorized.exception';
import { EnvironmentVariables } from '@common/configuration/environment.interface';
import { parseDurationToMs } from '@common/utils/parse-duration';
import { hash, verify } from '@common/utils/hash.util';
import { RefreshTokenRepository } from '../repository/refresh-token.repository';
import { Types } from 'mongoose';

/**
 * Service responsible for JWT token generation, verification, and refresh token persistence.
 *
 * This service encapsulates all token-related operations:
 * - Generating signed access tokens (short-lived)
 * - Generating signed refresh tokens (long-lived) and persisting them securely
 * - Verifying tokens and extracting their payload
 * - Matching stored (hashed) refresh tokens against provided tokens
 * - Revoking refresh tokens (single or all for a user)
 *
 * Refresh tokens are hashed using Argon2id before storage so that even
 * if the database is compromised, the raw tokens cannot be extracted.
 */
@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvironmentVariables>,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  /**
   * Generates a signed JWT access token.
   *
   * @param payload - The JWT payload containing the user identifier (`sub`) and email.
   * @returns A signed JWT string. The token expires based on `ACCESS_TOKEN_EXPIRE_IN` config.
   */
  generateAccessToken(payload: JwtPayload): string {
    const expiresIn = this.configService.get<string>(
      'ACCESS_TOKEN_EXPIRE_IN',
      '7d',
    );
    return this.jwtService.sign(payload, {
      expiresIn: expiresIn as JwtSignOptions['expiresIn'],
    });
  }

  /**
   * Generates a signed JWT refresh token.
   *
   * The token includes a `type: 'refresh'` field so that it can be
   * distinguished from access tokens during verification.
   *
   * @param payload - The JWT payload containing the user identifier (`sub`) and email.
   * @returns A signed JWT string. The token expires based on `REFRESH_TOKEN_EXPIRE_IN` config.
   */
  generateRefreshToken(payload: JwtPayload): string {
    const expiresIn = this.configService.get<string>(
      'REFRESH_TOKEN_EXPIRE_IN',
      '30d',
    );
    const refreshPayload = { ...payload, type: 'refresh' };
    return this.jwtService.sign(refreshPayload, {
      expiresIn: expiresIn as JwtSignOptions['expiresIn'],
    });
  }

  /**
   * Verifies a JWT token and returns its payload.
   *
   * @param token - The JWT string to verify.
   * @returns The decoded payload of type `JwtPayload`.
   * @throws CustomUnauthorizedException if the token is invalid or expired.
   */
  verifyToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify(token);
    } catch {
      throw new CustomUnauthorizedException('error.INVALID_OR_EXPIRED_TOKEN');
    }
  }

  /**
   * Hashes and persists a refresh token to the database.
   *
   * The raw refresh token is hashed using scrypt before storage.
   * This ensures that a database breach does not expose usable refresh tokens.
   *
   * @param userId - The MongoDB ObjectId of the user (as string).
   * @param refreshToken - The raw JWT refresh token to hash and store.
   * @param ipAddress - The IP address of the client issuing the request.
   * @param userAgent - The User-Agent header value, for session tracking.
   * @returns The hashed token (not the raw token).
   */
  async saveRefreshToken(
    userId: string,
    refreshToken: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<string> {
    const hashedToken = await hash(refreshToken);
    const expiresIn = this.configService.get<string>(
      'REFRESH_TOKEN_EXPIRE_IN',
      '30d',
    );
    const expiresAt = new Date(Date.now() + parseDurationToMs(expiresIn));

    await this.refreshTokenRepository.create({
      userId: new Types.ObjectId(userId),
      refreshToken: hashedToken,
      ipAddress,
      userAgent,
      expiresAt,
    });

    return hashedToken;
  }

  /**
   * Verifies a refresh token against stored (hashed) tokens for a user.
   *
   * Iterates over all non-expired tokens belonging to the user and
   * uses scrypt verification to find a match.
   *
   * @param userId - The MongoDB ObjectId of the user (as string).
   * @param refreshToken - The raw JWT refresh token to match against stored hashes.
   * @returns A `RefreshTokenPayload` (including `tokenId`) if a match is found, otherwise null.
   */
  async verifyRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<RefreshTokenPayload | null> {
    const tokens = await this.refreshTokenRepository.find(
      { userId: new Types.ObjectId(userId), expiresAt: { $gt: new Date() } },
      { projection: '+refreshToken', sort: { createdAt: -1 } },
    );

    for (const token of tokens) {
      if (await verify(token.refreshToken, refreshToken)) {
        return {
          sub: userId,
          email: '',
          type: 'refresh',
          tokenId: token._id.toString(),
        };
      }
    }

    return null;
  }

  /**
   * Deletes a single refresh token from the database.
   *
   * Used during token rotation to invalidate the old token after a successful refresh.
   *
   * @param tokenId - The MongoDB ObjectId of the RefreshToken document.
   */
  async revokeRefreshToken(tokenId: string): Promise<void> {
    await this.refreshTokenRepository.findByIdAndDelete(tokenId);
  }

  /**
   * Deletes all refresh tokens for a user.
   *
   * Used during logout to invalidate all active sessions across devices.
   *
   * @param userId - The MongoDB ObjectId of the user (as string).
   */
  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.refreshTokenRepository.deleteMany({
      userId: new Types.ObjectId(userId),
    });
  }
}
