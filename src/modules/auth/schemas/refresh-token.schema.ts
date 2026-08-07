import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

/**
 * Mongoose document type for refreshed tokens stored in the database.
 */
export type RefreshTokenDocument = HydratedDocument<RefreshToken>;

/**
 * Schema representing a stored (hashed) refresh token.
 *
 * Each issued refresh token is hashed with Argon2id and stored here,
 * allowing for revocation, rotation, and multi-session support.
 * The raw JWT is never stored — only its hash.
 */
@Schema({ timestamps: true })
export class RefreshToken {
  /**
   * The MongoDB ObjectId of the user this token belongs to.
   * Indexed for fast lookups during token verification.
   */
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId!: Types.ObjectId;

  /**
   * The Argon2id hash of the refresh token JWT.
   * `select: false` ensures it is never included in query projections by default.
   */
  @Prop({ required: true, select: false })
  refreshToken!: string;

  /**
   * The IP address of the client that issued the token request.
   * Optional — null when not provided.
   */
  @Prop({ type: String, default: null })
  ipAddress?: string | null;

  /**
   * The User-Agent string of the client's browser or app.
   * Optional — null when not provided.
   */
  @Prop({ type: String, default: null })
  userAgent?: string | null;

  /**
   * Absolute expiry timestamp. Tokens with `expiresAt` in the past
   * are treated as expired and ignored during refresh.
   * Indexed for automatic cleanup of expired tokens.
   */
  @Prop({ type: Date, required: true, index: true })
  expiresAt!: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
