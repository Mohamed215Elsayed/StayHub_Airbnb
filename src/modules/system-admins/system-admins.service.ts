import { Injectable, OnModuleInit } from '@nestjs/common';
import { SystemAdminResponseDto } from './dtos/system-admin-response.dto';
import { FindOneUsecase } from './use-cases/find-one.usecase';
import { InitializeSystemAdminUsecase } from './use-cases/initialize-system-admin.usecase';
import { QueryFilter } from 'mongoose';
import { SystemAdmin } from './schema/system-admin.schema';

@Injectable()
export class SystemAdminsService implements OnModuleInit {
  constructor(
    private readonly findOneUsecase: FindOneUsecase,
    private readonly initializeSystemAdminUsecase: InitializeSystemAdminUsecase,
  ) {}
  async onModuleInit(): Promise<void> {
    await this.initializeSystemAdminUsecase.execute();
  }

  async findOne(
    query: QueryFilter<SystemAdmin>,
  ): Promise<SystemAdminResponseDto | null> {
    const admin = await this.findOneUsecase.execute(query);
    return admin;
  }
}
