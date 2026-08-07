import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { RegisterAuthDto } from '../dto/register-auth.dto';
import {
  SerializedUser,
  UserDocument,
} from '@modules/users/schemas/user.schema';
import { UsersService } from '@modules/users/users.service';
import { GenerateTokensAndSaveUseCase } from './generateTokensAndSave.usecase';

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly usersService: UsersService,
    private readonly generateTokensAndSaveUseCase: GenerateTokensAndSaveUseCase,
  ) {}

  async execute(
    registerAuthDto: RegisterAuthDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<{
    user: SerializedUser;
    accessToken: string;
    refreshToken: string;
  }> {
    const createUserDto: CreateUserDto = {
      name: registerAuthDto.name,
      email: registerAuthDto.email,
      phoneNumber: registerAuthDto.phoneNumber,
      password: registerAuthDto.password,
    };

    const user: UserDocument = await this.usersService.create(createUserDto);
    const tokens = await this.generateTokensAndSaveUseCase.execute(
      user._id.toString(),
      user.email,
      ipAddress,
      userAgent,
    );
    return {
      user: user.toJSON() as SerializedUser,
      ...tokens,
    };
  }
}
