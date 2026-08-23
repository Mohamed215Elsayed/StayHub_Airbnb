import { Roles } from '@common/constants';
import { Request } from 'express';
/**
 * JWT payload embedded in signed tokens.
 * - `sub`: The user's MongoDB ObjectId (as string), used as the subject identifier.
 * - `email`: The user's email address.
 * - `type`: Optional — distinguishes token types (e.g. `"refresh"` for refresh tokens).
 */
export interface JwtPayload {
  sub: string;
  email: string;
  type?: string;
  role: Roles;
}

export interface CurrentUserData {
  _id: string;
  name: string;
  email: string;
}

export interface IPrincipal {
  user: CurrentUserData;
  role: Roles;
}

export interface RequestWithUser extends Request {
  user: JwtPayload;
}
/**
 * Extended JWT payload used during refresh-token verification.
 * Adds `tokenId` so the service can revoke the exact stored token after use.
 */
export interface RefreshTokenPayload extends JwtPayload {
  tokenId: string;
}

/**
 * Pair of tokens returned by the auth service on registration and login.
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Configuration shape for HttpOnly cookie security.
 */
export interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax' | 'strict' | 'none';
  maxAge: number;
}
