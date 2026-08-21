import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppSettingsSchema } from './schema/app-settings.schema';
import { ModelNames } from '@common/data-access';
import { AppSettingsController } from './app-settings.controller';
import { AppSettingsService } from './app-settings.service';
import { AppSettingsRepository } from './repository/app-settings.repository';
import { UpsertAppSettingsUseCase } from './use-cases/upsert-app-settings.usecase';
import { FindAllAppSettingsUsecase } from './use-cases/find-all-app-settings.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModelNames.APP_SETTINGS, schema: AppSettingsSchema },
    ]),
  ],
  controllers: [AppSettingsController],
  providers: [
    AppSettingsService,
    AppSettingsRepository,
    UpsertAppSettingsUseCase,
    FindAllAppSettingsUsecase,
  ],
  exports: [AppSettingsService, AppSettingsRepository],
})
export class AppSettingsModule {}
