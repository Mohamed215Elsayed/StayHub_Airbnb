import { SerializedUser } from '@modules/users/schemas/user.schema';
export interface JwtPayload {
  sub: string;
  email: string;
}

export interface AuthTokens {
  accessToken: string;
}

export interface AuthResponse {
  user: SerializedUser;
  accessToken: string;
}
