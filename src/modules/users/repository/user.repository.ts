import { Injectable } from '@nestjs/common';
import { BaseRepository, ModelNames } from '@common/data-access';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(
    @InjectModel(ModelNames.USERS)
    private readonly userModel: Model<User>,
  ) {
    super(userModel);
  }
}
