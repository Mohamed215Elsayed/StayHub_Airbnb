import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as argon2 from 'argon2';
import { RefreshToken } from '../schemas/refresh-token.schema';
import { JwtPayload, RefreshTokenPayload } from '../interfaces/auth.interface';
import { CustomUnauthorizedException } from '@common/error-handling/custom-exceptions/unauthorized.exception';
import { EnvironmentVariables } from '@common/configuration/environment.interface';
import { parseDurationToMs } from '@common/utils/parse-duration';

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
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshToken>,
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
      throw new CustomUnauthorizedException('Invalid or expired token');
    }
  }

  /**
   * Hashes and persists a refresh token to the database.
   *
   * The raw refresh token is hashed using Argon2id before storage.
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
    const hashedToken = await argon2.hash(refreshToken);
    const expiresIn = this.configService.get<string>(
      'REFRESH_TOKEN_EXPIRE_IN',
      '30d',
    );
    const expiresAt = new Date(Date.now() + parseDurationToMs(expiresIn));

    await this.refreshTokenModel.create({
      userId,
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
   * uses Argon2 verification to find a match.
   *
   * @param userId - The MongoDB ObjectId of the user (as string).
   * @param refreshToken - The raw JWT refresh token to match against stored hashes.
   * @returns A `RefreshTokenPayload` (including `tokenId`) if a match is found, otherwise null.
   */
  async verifyRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<RefreshTokenPayload | null> {
    const tokens = await this.refreshTokenModel
      .find({ userId, expiresAt: { $gt: new Date() } })
      .select('+refreshToken')
      .sort({ createdAt: -1 })
      .exec();

    for (const token of tokens) {
      if (await argon2.verify(token.refreshToken, refreshToken)) {
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
    await this.refreshTokenModel.findByIdAndDelete(tokenId);
  }

  /**
   * Deletes all refresh tokens for a user.
   *
   * Used during logout to invalidate all active sessions across devices.
   *
   * @param userId - The MongoDB ObjectId of the user (as string).
   */
  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.refreshTokenModel.deleteMany({ userId });
  }
}
