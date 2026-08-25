import { BaseRepository, ModelNames } from '@common/data-access';
import { Injectable } from '@nestjs/common';
import { Otp } from '../schemas/otp.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class OtpRepository extends BaseRepository<Otp> {
  constructor(
    @InjectModel(ModelNames.OTP)
    private readonly otpModel: Model<Otp>,
  ) {
    super(otpModel);
  }
}
