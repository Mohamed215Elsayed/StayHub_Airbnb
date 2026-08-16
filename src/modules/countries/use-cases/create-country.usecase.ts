import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { Country, CountryDocument } from '../schema/country.schema';
import { CustomConflictException } from '@common/error-handling/custom-exceptions/conflict.exception';
import { CreateCountryDto } from '../dtos/create-country.dto';
import { CountryResponseDto } from '../dtos/country-response.dto';

@Injectable()
export class CreateCountryUsecase {
  constructor(
    @InjectModel(Country.name)
    private readonly countryModel: Model<CountryDocument>,
  ) {}

  async execute(
    createCountryDto: CreateCountryDto,
  ): Promise<CountryResponseDto> {
    const existingByName = await this.countryModel
      .findOne({ name: createCountryDto.name, isDeleted: false })
      .lean()
      .exec();

    if (existingByName) {
      throw new CustomConflictException(
        'error.COUNTRY_NAME_ALREADY_REGISTERED',
      );
    }

    if (createCountryDto.countryCode) {
      const existingByCode = await this.countryModel
        .findOne({
          countryCode: createCountryDto.countryCode,
          isDeleted: false,
        })
        .lean()
        .exec();
      if (existingByCode) {
        throw new CustomConflictException(
          'error.COUNTRY_CODE_ALREADY_REGISTERED',
        );
      }
    }

    try {
      const doc: Partial<Country> = {
        name: createCountryDto.name,
      };
      if (createCountryDto.countryCode) {
        doc.countryCode = createCountryDto.countryCode;
      }

      const country = await this.countryModel.create(doc);

      const plain = country.toObject();
      const result = plainToInstance(CountryResponseDto, plain, {
        excludeExtraneousValues: true,
      });

      return result;
    } catch (error: unknown) {
      const duplicateError = error as {
        code?: number;
        keyPattern?: Record<string, unknown>;
      };
      if (duplicateError.code === 11000 && duplicateError.keyPattern) {
        const field = Object.keys(duplicateError.keyPattern)[0];
        const errorKey =
          field === 'name'
            ? 'error.COUNTRY_NAME_ALREADY_REGISTERED'
            : field === 'countryCode'
              ? 'error.COUNTRY_CODE_ALREADY_REGISTERED'
              : 'error.COUNTRY_ALREADY_EXISTS';

        throw new CustomConflictException(errorKey);
      }
      throw error;
    }
  }
}
