import { Injectable } from '@nestjs/common';
import { CityRepository } from '../repository/city.repository';
import { FindAllCitiesDto } from '../dtos/find-all-cities.dto';
import { PaginatedResult } from '@common/data-access';
import { CityResponseDto } from '../dtos/city-response.dto';
import { QueryFilter } from 'mongoose';
import { City } from '../schema/city.schema';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class FindAllCitiesUsecase {
  constructor(private readonly cityRepository: CityRepository) {}
  async execute(
    query: FindAllCitiesDto,
  ): Promise<PaginatedResult<CityResponseDto>> {
    const matchQuery: QueryFilter<City> = {
      isDeleted: false,
    };
    if (query?.name) matchQuery.name = { $regex: query.name, $options: 'i' };
    if (query?.country) matchQuery.country = query.country;

    const result = await this.cityRepository.findPaginated(matchQuery, {
      page: query?.page,
      limit: query?.limit,
      ignoreLimit: query?.ignoreLimit,
      populate: [{ path: 'country', select: 'name' }],
      lean: true,
    });

    return new PaginatedResult(
      plainToInstance(CityResponseDto, result.data, {
        excludeExtraneousValues: true,
      }),
      result.totalCount,
      result.page,
      result.limit,
    );
  }
}
