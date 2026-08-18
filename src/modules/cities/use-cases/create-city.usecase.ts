import { Injectable } from '@nestjs/common';
import { CityRepository } from '../repository/city.repository';
import { CityResponseDto } from '../dtos/city-response.dto';
import { CreateCityDto } from '../dtos/create-city.dto';
import { CustomConflictException } from '@common/error-handling/custom-exceptions/conflict.exception';
import { plainToInstance } from 'class-transformer';
import { CountriesService } from '../../countries/countries.service';

@Injectable()
export class CreateCityUsecase {
  constructor(
    private readonly cityRepository: CityRepository,
    private readonly countriesService: CountriesService,
  ) {}

  async execute(body: CreateCityDto): Promise<CityResponseDto> {
    // validate city name not duplicated per country
    const existingCityByName = await this.cityRepository.findOne({
      name: body.name,
      country: body.country,
      isDeleted: false,
    });

    if (existingCityByName) {
      throw new CustomConflictException('error.CITY_ALREADY_EXISTS');
    }
    // validate country id
    await this.countriesService.getCountryById(body.country.toString());

    const city = await this.cityRepository.create(body);

    return plainToInstance(CityResponseDto, city.toObject(), {
      excludeExtraneousValues: true,
    });
  }
}
