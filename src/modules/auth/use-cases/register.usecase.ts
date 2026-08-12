import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { Injectable, Logger } from '@nestjs/common';
import { RegisterAuthDto } from '../dto/register-auth.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { UsersService } from '@modules/users/users.service';
import { GenerateTokensAndSaveUseCase } from './generateTokensAndSave.usecase';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class RegisterUseCase {
  private readonly logger = new Logger(RegisterUseCase.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly generateTokensAndSaveUseCase: GenerateTokensAndSaveUseCase,
  ) {}

  async execute(
    registerAuthDto: RegisterAuthDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthResponseDto> {
    const createUserDto = plainToInstance(CreateUserDto, registerAuthDto);
    // const createUserDto: CreateUserDto = {
    //   name: registerAuthDto.name,
    //   email: registerAuthDto.email,
    //   phoneNumber: registerAuthDto.phoneNumber,
    //   password: registerAuthDto.password,
    // };

    const user = await this.usersService.create(createUserDto);
    this.logger.log(`User created: ${user.id}`);
    const tokens = await this.generateTokensAndSaveUseCase.execute(
      user.id,
      user.email,
      ipAddress,
      userAgent,
    );
    this.logger.log(`Tokens generated for user: ${user.id}`);
    return plainToInstance(AuthResponseDto, {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      ...tokens,
    });
  }
}
