import { Injectable } from '@nestjs/common';
import { Country } from '../schemas/country.schema';
import { plainToInstance } from 'class-transformer';
import { CountryResponseDto } from '../dtos/country-response.dto';
import { CountryRepository } from '../repository/country.repository';

@Injectable()
export class FindOneCountryUsecase {
  constructor(private readonly countryRepository: CountryRepository) {}

  async execute(
    query: Record<string, unknown>,
  ): Promise<CountryResponseDto | null> {
    const country = await this.countryRepository.findOne({
      ...query,
      isDeleted: false,
    });

    if (country) {
      return plainToInstance(CountryResponseDto, country, {
        excludeExtraneousValues: true,
      });
    }

    return null;
  }
}
