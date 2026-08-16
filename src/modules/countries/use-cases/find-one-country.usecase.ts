import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Country, CountryDocument } from '../schema/country.schema';
import { Model, QueryFilter } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { CountryResponseDto } from '../dtos/country-response.dto';

@Injectable()
export class FindOneCountryUsecase {
  private readonly logger = new Logger(FindOneCountryUsecase.name);

  constructor(
    @InjectModel(Country.name)
    private readonly countryModel: Model<CountryDocument>,
  ) {}

  async execute(
    query: QueryFilter<Country>,
  ): Promise<CountryResponseDto | null> {
    this.logger.log(`Finding country with query: ${JSON.stringify(query)}`);

    const country = await this.countryModel
      .findOne({ ...query, isDeleted: false })
      .lean()
      .exec();

    if (country) {
      this.logger.log(`Country found with id: ${country._id.toString()}`);
    } else {
      this.logger.warn('Country not found with given query');
    }

    return country
      ? plainToInstance(CountryResponseDto, country, {
          excludeExtraneousValues: true,
        })
      : null;
  }
}
