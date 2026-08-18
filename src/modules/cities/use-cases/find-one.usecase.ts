import { Injectable } from '@nestjs/common';
import { CityRepository } from '../repository/city.repository';
import { CityResponseDto } from '../dtos/city-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class FindOneUsecase {
  constructor(private readonly cityRepository: CityRepository) {}

  async execute(
    query: Record<string, unknown>,
  ): Promise<CityResponseDto | null> {
    const city = await this.cityRepository.findOne({
      ...query,
      isDeleted: false,
    });

    if (city) {
      return plainToInstance(CityResponseDto, city, {
        excludeExtraneousValues: true,
      });
    }

    return null;
  }
}
