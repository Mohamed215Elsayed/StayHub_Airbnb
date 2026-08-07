import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

import { UsersService } from '@modules/users/users.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { TokenService } from './tokens/token.service';
import { JwtPayload, AuthResponse } from './interfaces/auth.interface';
import {
  SerializedUser,
  UserDocument,
} from '@modules/users/schemas/user.schema';
import { LoginAuthDto } from './dto/login-auth.dto';
import { CustomUnauthorizedException } from '@common/error-handling/custom-exceptions/unauthorized.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  private async generateTokensAndSave(
    user: UserDocument,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JwtPayload = { sub: user._id.toString(), email: user.email };
    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);

    await this.tokenService.saveRefreshToken(
      user._id.toString(),
      refreshToken,
      ipAddress,
      userAgent,
    );

    return { accessToken, refreshToken };
  }

  async register(
    registerAuthDto: RegisterAuthDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthResponse> {
    const createUserDto: CreateUserDto = {
      name: registerAuthDto.name,
      email: registerAuthDto.email,
      phoneNumber: registerAuthDto.phoneNumber,
      password: registerAuthDto.password,
    };

    const user: UserDocument = await this.usersService.create(createUserDto);
    const tokens = await this.generateTokensAndSave(user, ipAddress, userAgent);
    return {
      user: user.toJSON() as SerializedUser,
      ...tokens,
    };
  }

  async login(
    loginAuthDto: LoginAuthDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthResponse> {
    const { email, password } = loginAuthDto;

    const user = await this.usersService.findOne(
      { email },
      { includePassword: true },
    );

    if (!user || !(await argon2.verify(user.password, password))) {
      throw new CustomUnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokensAndSave(user, ipAddress, userAgent);
    return {
      user: user.toJSON() as SerializedUser,
      ...tokens,
    };
  }

  async refresh(
    refreshToken: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = this.tokenService.verifyToken(refreshToken);

    if (payload.type !== 'refresh') {
      throw new CustomUnauthorizedException('Invalid refresh token');
    }

    const matchedToken = await this.tokenService.verifyRefreshToken(
      payload.sub,
      refreshToken,
    );

    if (!matchedToken) {
      throw new CustomUnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersService.findOne(
      { _id: payload.sub },
      { includePassword: false },
    );

    if (!user) {
      throw new CustomUnauthorizedException('Invalid refresh token');
    }

    await this.tokenService.revokeRefreshToken(matchedToken.tokenId);

    const newPayload: JwtPayload = {
      sub: user._id.toString(),
      email: user.email,
    };
    const newAccessToken = this.tokenService.generateAccessToken(newPayload);
    const newRefreshToken = this.tokenService.generateRefreshToken(newPayload);

    await this.tokenService.saveRefreshToken(
      user._id.toString(),
      newRefreshToken,
      ipAddress,
      userAgent,
    );

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(userId: string): Promise<void> {
    await this.tokenService.revokeAllUserTokens(userId);
  }
}
