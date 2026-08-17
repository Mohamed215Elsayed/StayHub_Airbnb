import { BaseRepository, ModelNames } from '@common/data-access';
import { Injectable } from '@nestjs/common';
import { Country } from '../schemas/country.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CountryRepository extends BaseRepository<Country> {
  constructor(
    @InjectModel(ModelNames.COUNTRIES)
    private readonly countryModel: Model<Country>,
  ) {
    super(countryModel);
  }
}
