import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CustomConflictException } from '@common/error-handling/custom-exceptions/conflict.exception';
import { CreateCountryDto } from '../dtos/create-country.dto';
import { CountryResponseDto } from '../dtos/country-response.dto';
import { CountryRepository } from '../repository/country.repository';
import { Country } from '../schemas/country.schema';

@Injectable()
export class CreateCountryUsecase {
  constructor(private readonly countryRepository: CountryRepository) {}

  async execute(body: CreateCountryDto): Promise<CountryResponseDto> {
    const existingByName = await this.countryRepository.findOne({
      name: body.name,
      isDeleted: false,
    });

    if (existingByName) {
      throw new CustomConflictException(
        'error.COUNTRY_NAME_ALREADY_REGISTERED',
      );
    }

    if (body.countryCode) {
      const existingByCode = await this.countryRepository.findOne({
        countryCode: body.countryCode,
        isDeleted: false,
      });
      if (existingByCode) {
        throw new CustomConflictException(
          'error.COUNTRY_CODE_ALREADY_REGISTERED',
        );
      }
    }

    try {
      const doc: Partial<Country> = {
        name: body.name,
      };
      if (body.countryCode) {
        doc.countryCode = body.countryCode;
      }

      const country = await this.countryRepository.create(doc);

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
