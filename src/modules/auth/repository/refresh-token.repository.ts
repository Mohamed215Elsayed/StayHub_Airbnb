import { Injectable } from '@nestjs/common';
import { BaseRepository, ModelNames } from '@common/data-access';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RefreshToken } from '../schema/refresh-token.schema';

@Injectable()
export class RefreshTokenRepository extends BaseRepository<RefreshToken> {
  constructor(
    @InjectModel(ModelNames.REFRESH_TOKENS)
    private readonly refreshTokenModel: Model<RefreshToken>,
  ) {
    super(refreshTokenModel);
  }
}
