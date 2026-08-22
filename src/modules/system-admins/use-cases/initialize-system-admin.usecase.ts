import { Injectable, Logger } from '@nestjs/common';
import { SystemAdminRepository } from '../repository/system-admin.repository';
import { ConfigService } from '@nestjs/config';
import {
  EnvironmentVariables,
  ISystemAdmin,
} from '@common/configuration/environment.interface';
import { hash } from '@common/utils/hash.util';
import { SystemAdminResponseDto } from '../dtos/system-admin-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class InitializeSystemAdminUsecase {
  private logger = new Logger(InitializeSystemAdminUsecase.name);

  constructor(
    private readonly systemAdminRepository: SystemAdminRepository,
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {}

  async execute(): Promise<SystemAdminResponseDto> {
    const { name, email, password } =
      this.configService.getOrThrow<ISystemAdmin>('SYSTEM_ADMIN');

    const existingAdmin = await this.systemAdminRepository.findOne({
      email,
      isDeleted: false,
    });

    if (existingAdmin) {
      this.logger.log('System admin already initialized');
      return plainToInstance(SystemAdminResponseDto, existingAdmin, {
        excludeExtraneousValues: true,
      });
    }

    const hashedPassword = await hash(password);

    const createdAdmin = await this.systemAdminRepository.create({
      name,
      email,
      password: hashedPassword,
      isSuperAdmin: true,
      isDeleted: false,
    });

    this.logger.log('System admin initialized');

    return plainToInstance(SystemAdminResponseDto, createdAdmin.toObject(), {
      excludeExtraneousValues: true,
    });
  }
}
