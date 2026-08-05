import { Injectable } from '@nestjs/common';
import { UsersService } from '@modules/users/users.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { TokenService } from './tokens/token.service';
import { JwtPayload, AuthResponse } from './interfaces/auth.interface';
import {
  SerializedUser,
  UserDocument,
} from '@modules/users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  /**
   * Registers a new user and returns an access token.
   *
   * @param registerAuthDto - Registration data (name, email, phoneNumber, password).
   * @returns Object containing the created user (password stripped) and an access token.
   * @throws CustomConflictException if email or phone number is already taken.
   */
  async register(registerAuthDto: RegisterAuthDto): Promise<AuthResponse> {
    const createUserDto: CreateUserDto = {
      name: registerAuthDto.name,
      email: registerAuthDto.email,
      phoneNumber: registerAuthDto.phoneNumber,
      password: registerAuthDto.password,
    };

    const user: UserDocument = await this.usersService.create(createUserDto);
    const payload: JwtPayload = { sub: user._id.toString(), email: user.email };
    const accessToken = this.tokenService.generateAccessToken(payload);

    return {
      user: user.toJSON() as SerializedUser,
      accessToken,
    };
  }
}
