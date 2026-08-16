import { Injectable } from '@nestjs/common';
import { CustomNotFoundException } from '@common/error-handling/custom-exceptions/not-found.exception';
import { CountryResponseDto } from '../dtos/country-response.dto';
import { FindOneCountryUsecase } from './find-one-country.usecase';

@Injectable()
export class FindCountryByIdUsecase {
  constructor(private readonly findOneCountryUsecase: FindOneCountryUsecase) {}

  async execute(id: string): Promise<CountryResponseDto> {
    const country = await this.findOneCountryUsecase.execute({ _id: id });

    if (!country) {
      throw new CustomNotFoundException('error.COUNTRY_NOT_FOUND');
    }

    return country;
  }
}
