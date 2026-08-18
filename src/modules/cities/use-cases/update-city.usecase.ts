import { Injectable } from '@nestjs/common';
import { CityRepository } from '../repository/city.repository';
import { CityResponseDto } from '../dtos/city-response.dto';
import { UpdateCityDto } from '../dtos/update-city.dto';
import { CustomNotFoundException } from '@common/error-handling/custom-exceptions/not-found.exception';
import { CustomConflictException } from '@common/error-handling/custom-exceptions/conflict.exception';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UpdateCityUsecase {
  constructor(private readonly cityRepository: CityRepository) {}
  async execute(cityId: string, body: UpdateCityDto): Promise<CityResponseDto> {
    const city = await this.cityRepository.findOne({
      _id: cityId,
      isDeleted: false,
    });
    if (!city) throw new CustomNotFoundException('error.CITY_NOT_FOUND');

    const existingCityByName = await this.cityRepository.findOne({
      name: body.name,
      country: city.country,
      isDeleted: false,
      _id: { $ne: cityId },
    });
    if (existingCityByName)
      throw new CustomConflictException('error.CITY_ALREADY_EXISTS');

    const updatedCity = await this.cityRepository.findByIdAndUpdate(
      cityId,
      body,
    );

    if (!updatedCity) {
      throw new CustomNotFoundException('error.CITY_NOT_FOUND');
    }

    return plainToInstance(CityResponseDto, updatedCity.toObject(), {
      excludeExtraneousValues: true,
    });
  }
}
