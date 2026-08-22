import { Injectable } from '@nestjs/common';
import { UpsertAppSettingsDto } from './dtos/upsert-app-settings.dto';
import { AppSettingsResponseDto } from './dtos/app-settings-response.dto';
import { UpsertAppSettingsUsecase } from './use-cases/upsert-app-settings.usecase';
import { FindAllAppSettingsUsecase } from './use-cases/find-all-app-settings.usecase';

@Injectable()
export class AppSettingsService {
  constructor(
    private readonly upsertAppSettingsUsecase: UpsertAppSettingsUsecase,
    private readonly findAllAppSettingsUsecase: FindAllAppSettingsUsecase,
  ) {}

  async upsertAppSettings(
    id: string,
    body: UpsertAppSettingsDto,
  ): Promise<AppSettingsResponseDto> {
    return this.upsertAppSettingsUsecase.execute(id, body);
  }

  async findAllAppSettings(): Promise<AppSettingsResponseDto> {
    return this.findAllAppSettingsUsecase.execute();
  }
}
