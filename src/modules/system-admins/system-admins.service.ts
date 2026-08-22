import { Injectable, OnModuleInit } from '@nestjs/common';
import { SystemAdminResponseDto } from './dtos/system-admin-response.dto';
import { FindOneUsecase } from './use-cases/find-one.usecase';
import { InitializeSystemAdminUsecase } from './use-cases/initialize-system-admin.usecase';
import { QueryFilter } from 'mongoose';
import { SystemAdmin } from './schema/system-admin.schema';
import { SystemAdminRepository } from './repository/system-admin.repository';

@Injectable()
export class SystemAdminsService implements OnModuleInit {
  constructor(
    private readonly findOneUsecase: FindOneUsecase,
    private readonly initializeSystemAdminUsecase: InitializeSystemAdminUsecase,
    private readonly systemAdminRepository: SystemAdminRepository,
  ) {}
  async onModuleInit(): Promise<void> {
    await this.initializeSystemAdminUsecase.execute();
  }

  async findOne(
    query: QueryFilter<SystemAdmin>,
  ): Promise<SystemAdminResponseDto>;

  async findOne(
    query: QueryFilter<SystemAdmin>,
    options: { includePassword: true },
  ): Promise<(SystemAdmin & { _id: string }) | null>;

  async findOne(
    query: QueryFilter<SystemAdmin>,
    options?: { includePassword?: boolean },
  ): Promise<
    | SystemAdminResponseDto
    | (SystemAdmin & { _id: string })
    | null
  > {
    if (options?.includePassword) {
      return this.systemAdminRepository.findOne(
        query,
        undefined,
        undefined,
      ) as unknown as SystemAdmin & { _id: string };
    }
    return this.findOneUsecase.execute(query);
  }
}
