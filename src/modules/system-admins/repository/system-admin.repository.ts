import { BaseRepository, ModelNames } from '@common/data-access';
import { Injectable } from '@nestjs/common';
import { SystemAdmin } from '../schema/system-admin.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SystemAdminRepository extends BaseRepository<SystemAdmin> {
  constructor(
    @InjectModel(ModelNames.SYSTEM_ADMINS)
    private readonly systemAdminModel: Model<SystemAdmin>,
  ) {
    super(systemAdminModel);
  }
}
