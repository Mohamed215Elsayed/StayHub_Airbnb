import { BaseRepository, ModelNames } from '@common/data-access';
import { Injectable } from '@nestjs/common';
import { ForgetPassword } from '../schemas/forget-password.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ForgetPasswordRepository extends BaseRepository<ForgetPassword> {
  constructor(
    @InjectModel(ModelNames.FORGET_PASSWORD)
    private readonly forgetPasswordModel: Model<ForgetPassword>,
  ) {
    super(forgetPasswordModel);
  }
}
