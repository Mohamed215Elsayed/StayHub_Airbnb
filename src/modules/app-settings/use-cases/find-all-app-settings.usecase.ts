import { Injectable } from '@nestjs/common';
import { AppSettingsRepository } from '../repository/app-settings.repository';
import { AppSettingsResponseDto } from '../dtos/app-settings-response.dto';
import { CustomNotFoundException } from '@common/error-handling/custom-exceptions/not-found.exception';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class FindAllAppSettingsUsecase {
  constructor(private readonly appSettingsRepository: AppSettingsRepository) {}

  async execute(): Promise<AppSettingsResponseDto> {
    const result = await this.appSettingsRepository.findOne({
      isDeleted: false,
    });

    if (!result) {
      throw new CustomNotFoundException('error.APP_SETTINGS_NOT_FOUND');
    }

    return plainToInstance(AppSettingsResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }
}
