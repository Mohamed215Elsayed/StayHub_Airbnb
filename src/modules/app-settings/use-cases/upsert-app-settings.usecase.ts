import { Injectable } from '@nestjs/common';
import { AppSettingsRepository } from '../repository/app-settings.repository';
import { UpsertAppSettingsDto } from '../dtos/upsert-app-settings.dto';
import { AppSettingsResponseDto } from '../dtos/app-settings-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UpsertAppSettingsUseCase {
  constructor(private readonly appSettingsRepository: AppSettingsRepository) {}

  async execute(
    id?: string,
    body?: UpsertAppSettingsDto,
  ): Promise<AppSettingsResponseDto> {
    const filter = id ? { _id: id } : {};
    const update = body ? { $set: body } : {};

    const appSettings = await this.appSettingsRepository.findOneAndUpdate(
      filter,
      update,
      { upsert: true, returnDocument: 'after', lean: true },
    );

    return plainToInstance(AppSettingsResponseDto, appSettings);
  }
}
