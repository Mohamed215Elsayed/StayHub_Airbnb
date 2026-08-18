import { BaseRepository, ModelNames } from '@common/data-access';
import { Injectable } from '@nestjs/common';
import { Currency } from '../schema/currency.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CurrencyRepository extends BaseRepository<Currency> {
  constructor(
    @InjectModel(ModelNames.CURRENCIES)
    private readonly currencyModel: Model<Currency>,
  ) {
    super(currencyModel);
  }
}
