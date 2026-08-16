import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Country, CountryDocument } from '../schema/country.schema';
import { Model, QueryFilter } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { CountryResponseDto } from '../dtos/country-response.dto';
import { FindAllDto } from '../dtos/find-all.dto';

@Injectable()
export class FindAllCountriesUsecase {
  constructor(
    @InjectModel(Country.name)
    private readonly countryModel: Model<CountryDocument>,
  ) {}

  async execute(query: FindAllDto): Promise<CountryResponseDto[]> {
    const page: number = query.page || 1;
    const limit: number = query.limit || 10;
    const skip = (page - 1) * limit;

    const matchQuery: QueryFilter<Country> = { isDeleted: { $ne: true } };
    if (query?.name) matchQuery.name = { $regex: query.name, $options: 'i' };
    if (query?.countryCode) matchQuery.countryCode = query.countryCode;
    const countries = await this.countryModel
      .find(matchQuery)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return plainToInstance(CountryResponseDto, countries, {
      excludeExtraneousValues: true,
    });
  }
}
