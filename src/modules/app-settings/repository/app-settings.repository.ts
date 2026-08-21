import { BaseRepository, ModelNames } from '@common/data-access';
import { Injectable } from '@nestjs/common';
import { AppSettings } from '../schema/app-settings.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AppSettingsRepository extends BaseRepository<AppSettings> {
  constructor(
    @InjectModel(ModelNames.APP_SETTINGS)
    private readonly appSettingsModel: Model<AppSettings>,
  ) {
    super(appSettingsModel);
  }
}
