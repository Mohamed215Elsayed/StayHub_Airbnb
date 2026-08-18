import { Injectable } from '@nestjs/common';
import { CityRepository } from '../repository/city.repository';
import { CityResponseDto } from '../dtos/city-response.dto';
import { CreateCityDto } from '../dtos/create-city.dto';
import { CustomConflictException } from '@common/error-handling/custom-exceptions/conflict.exception';
import { plainToInstance } from 'class-transformer';
import { CountriesService } from '../../countries/countries.service';
import { Types } from 'mongoose';

@Injectable()
export class CreateCityUsecase {
  constructor(
    private readonly cityRepository: CityRepository,
    private readonly countriesService: CountriesService,
  ) {}

  async execute(body: CreateCityDto): Promise<CityResponseDto> {
    const existingCityByName = await this.cityRepository.findOne({
      name: body.name,
      country: body.country,
      isDeleted: false,
    });

    if (existingCityByName) {
      throw new CustomConflictException('error.CITY_ALREADY_EXISTS');
    }

    await this.countriesService.getCountryById(body.country);

    const city = await this.cityRepository.create({
      name: body.name,
      country: body.country as unknown as Types.ObjectId,
    });

    return plainToInstance(CityResponseDto, city.toObject(), {
      excludeExtraneousValues: true,
    });
  }
}
