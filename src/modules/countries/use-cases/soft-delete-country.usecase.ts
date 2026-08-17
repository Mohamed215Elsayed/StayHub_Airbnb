import { Injectable } from '@nestjs/common';
import { CountryResponseDto } from '../dtos/country-response.dto';
import { plainToInstance } from 'class-transformer';
import { CustomNotFoundException } from '@common/error-handling/custom-exceptions/not-found.exception';
import { CountryRepository } from '../repository/country.repository';

@Injectable()
export class SoftDeleteCountryUsecase {
  constructor(
    private readonly countryRepository: CountryRepository,
  ) {}

  async execute(id: string): Promise<CountryResponseDto> {
    const country = await this.countryRepository.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true, deletedAt: new Date() } },
    );

    if (!country) {
      throw new CustomNotFoundException('error.COUNTRY_NOT_FOUND');
    }

    return plainToInstance(CountryResponseDto, country, {
      excludeExtraneousValues: true,
    });
  }
}
