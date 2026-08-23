import { Injectable, Logger } from '@nestjs/common';
import { Roles } from '@common/constants';
import { RegisterAuthDto } from '../dto/register-auth.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { UsersService } from '@modules/users/users.service';
import { GenerateTokensAndSaveUsecase } from './generateTokensAndSave.usecase';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class RegisterUsecase {
  private readonly logger = new Logger(RegisterUsecase.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly generateTokensAndSaveUsecase: GenerateTokensAndSaveUsecase,
  ) {}

  async execute(
    registerAuthDto: RegisterAuthDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthResponseDto> {
    const user = await this.usersService.create(registerAuthDto);
    this.logger.log(`User created: ${user.id}`);
    const tokens = await this.generateTokensAndSaveUsecase.execute(
      user.id,
      user.email,
      Roles.USER,
      ipAddress,
      userAgent,
    );
    this.logger.log(`Tokens generated for user: ${user.id}`);
    return plainToInstance(
      AuthResponseDto,
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: Roles.USER,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        ...tokens,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
