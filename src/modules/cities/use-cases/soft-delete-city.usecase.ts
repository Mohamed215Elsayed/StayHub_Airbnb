import { Injectable } from '@nestjs/common';
import { CityResponseDto } from '../dtos/city-response.dto';
import { plainToInstance } from 'class-transformer';
import { CustomNotFoundException } from '@common/error-handling/custom-exceptions/not-found.exception';
import { CityRepository } from '../repository/city.repository';

@Injectable()
export class SoftDeleteCityUsecase {
  constructor(private readonly cityRepository: CityRepository) {}

  async execute(cityId: string): Promise<CityResponseDto> {
    const city = await this.cityRepository.findByIdAndUpdate(cityId, {
      $set: { isDeleted: true, deletedAt: new Date() },
    });

    if (!city) {
      throw new CustomNotFoundException('error.CITY_NOT_FOUND');
    }

    return plainToInstance(CityResponseDto, city, {
      excludeExtraneousValues: true,
    });
  }
}
