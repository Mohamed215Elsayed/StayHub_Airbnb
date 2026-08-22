import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SystemAdminSchema } from './schema/system-admin.schema';
import { ModelNames } from '@common/data-access';
import { SystemAdminsService } from './system-admins.service';
import { SystemAdminRepository } from './repository/system-admin.repository';
import { FindOneUsecase } from './use-cases/find-one.usecase';
import { InitializeSystemAdminUsecase } from './use-cases/initialize-system-admin.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModelNames.SYSTEM_ADMINS, schema: SystemAdminSchema },
    ]),
  ],
  providers: [
    SystemAdminsService,
    SystemAdminRepository,
    FindOneUsecase,
    InitializeSystemAdminUsecase,
  ],
  exports: [SystemAdminsService, SystemAdminRepository],
})
export class SystemAdminsModule {}
