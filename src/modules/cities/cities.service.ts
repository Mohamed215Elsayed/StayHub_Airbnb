import { Injectable } from '@nestjs/common';
import { CreateCityDto } from './dtos/create-city.dto';
import { CityResponseDto } from './dtos/city-response.dto';
import { CreateCityUsecase } from './use-cases/create-city.usecase';
import { FindAllCitiesDto } from './dtos/find-all-cities.dto';
import { PaginatedResult } from '@common/data-access';
import { FindAllCitiesUsecase } from './use-cases/find-all-cities.usecase';
import { UpdateCityUsecase } from './use-cases/update-city.usecase';
import { UpdateCityDto } from './dtos/update-city.dto';
import { FindOneUsecase } from './use-cases/find-one.usecase';
import { FindCityByIdUsecase } from './use-cases/find-city-by-id.usecase';
import { SoftDeleteCityUsecase } from './use-cases/soft-delete-city.usecase';

@Injectable()
export class CitiesService {
  constructor(
    private readonly createCityUsecase: CreateCityUsecase,
    private readonly findAllCitiesUsecase: FindAllCitiesUsecase,
    private readonly updateCityUsecase: UpdateCityUsecase,
    private readonly findOneUsecase: FindOneUsecase,
    private readonly findCityByIdUsecase: FindCityByIdUsecase,
    private readonly deleteCityUsecase: SoftDeleteCityUsecase,
  ) {}

  async createCity(createCityDto: CreateCityDto): Promise<CityResponseDto> {
    return this.createCityUsecase.execute(createCityDto);
  }

  async findAllCities(
    query: FindAllCitiesDto,
  ): Promise<PaginatedResult<CityResponseDto>> {
    return this.findAllCitiesUsecase.execute(query);
  }

  async updateCity(
    cityId: string,
    body: UpdateCityDto,
  ): Promise<CityResponseDto> {
    return this.updateCityUsecase.execute(cityId, body);
  }

  async findOne(
    query: Record<string, unknown>,
  ): Promise<CityResponseDto | null> {
    return this.findOneUsecase.execute(query);
  }

  async findCityById(cityId: string): Promise<CityResponseDto> {
    return this.findCityByIdUsecase.execute(cityId);
  }

  async deleteCity(cityId: string): Promise<CityResponseDto> {
    return this.deleteCityUsecase.execute(cityId);
  }
}
