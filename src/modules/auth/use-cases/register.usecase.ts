import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { RegisterAuthDto } from '../dto/register-auth.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
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
  ): Promise<AuthResponseDto> {
    const createUserDto: CreateUserDto = {
      name: registerAuthDto.name,
      email: registerAuthDto.email,
      phoneNumber: registerAuthDto.phoneNumber,
      password: registerAuthDto.password,
    };

    const user = await this.usersService.create(createUserDto);
    const tokens = await this.generateTokensAndSaveUseCase.execute(
      user.id,
      user.email,
      ipAddress,
      userAgent,
    );
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      ...tokens,
    };
  }
}
