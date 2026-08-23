import { API_TAGS } from '@common/swagger';
import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppSettingsService } from './app-settings.service';
import { UpsertAppSettingsDto } from './dtos/upsert-app-settings.dto';
import { AppSettingsResponseDto } from './dtos/app-settings-response.dto';
import { UpsertAppSettingsSwagger } from './swagger';
import { FindAllAppSettingsSwagger } from './swagger/find-all-app-settings.swagger';
import { Authorize } from '@modules/auth/decorators/roles.decorator';
import { Roles } from '@common/constants';

@ApiTags(API_TAGS.APP_SETTINGS)
@Controller('app-settings')
export class AppSettingsController {
  constructor(private readonly appSettingsService: AppSettingsService) {}

  @UpsertAppSettingsSwagger()
  @Put(':id')
  @Authorize(Roles.SYSTEM_ADMIN)
  async upsertAppSettings(
    @Param('id') id: string,
    @Body() body: UpsertAppSettingsDto,
  ): Promise<AppSettingsResponseDto> {
    return this.appSettingsService.upsertAppSettings(id, body);
  }

  @FindAllAppSettingsSwagger()
  @Get()
  async findAllAppSettings(): Promise<AppSettingsResponseDto> {
    return this.appSettingsService.findAllAppSettings();
  }
}
