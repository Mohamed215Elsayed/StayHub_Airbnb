import { Injectable, Logger } from '@nestjs/common';
import { CreateCountryUsecase } from './use-cases/create-country.usecase';
import { CreateCountryDto } from './dtos/create-country.dto';
import { CountryResponseDto } from './dtos/country-response.dto';
import { FindCountryByIdUsecase } from './use-cases/find-country-by-id.usecase';
import { FindAllCountriesUsecase } from './use-cases/find-all-countries.usecase';
import { SoftDeleteCountryUsecase } from './use-cases/soft-delete-country.usecase';
import { FindAllDto } from './dtos/find-all.dto';
import { FindOneCountryUsecase } from './use-cases/find-one-country.usecase';
import { UpdateCountryUsecase } from './use-cases/update-country.usecase';
import { UpdateCountryDto } from './dtos/update-country.dto';
import { QueryFilter } from 'mongoose';
import { Country } from './schemas/country.schema';
import { PaginatedResult } from '@common/data-access';

@Injectable()
export class CountriesService {
  private readonly logger = new Logger(CountriesService.name);

  constructor(
    private readonly createCountryUsecase: CreateCountryUsecase,
    private readonly findCountryByIdUsecase: FindCountryByIdUsecase,
    private readonly findAllCountriesUsecase: FindAllCountriesUsecase,
    private readonly softDeleteCountryUsecase: SoftDeleteCountryUsecase,
    private readonly findOneCountryUsecase: FindOneCountryUsecase,
    private readonly updateCountryUsecase: UpdateCountryUsecase,
  ) {}

  async create(
    createCountryDto: CreateCountryDto,
  ): Promise<CountryResponseDto> {
    this.logger.log('Create country request received');
    const result = await this.createCountryUsecase.execute(createCountryDto);
    this.logger.log('Create country request completed');
    return result;
  }

  async getCountryById(id: string): Promise<CountryResponseDto> {
    this.logger.log(`Get country by id request received for id: ${id}`);
    const result = await this.findCountryByIdUsecase.execute(id);
    this.logger.log(`Get country by id request completed for id: ${id}`);
    return result;
  }

  async findAll(
    query: FindAllDto,
  ): Promise<PaginatedResult<CountryResponseDto>> {
    this.logger.log('Find all countries request received');
    const result = await this.findAllCountriesUsecase.execute(query);
    this.logger.log('Find all countries request completed');
    return result;
  }
  async delete(id: string): Promise<CountryResponseDto> {
    this.logger.log(`Delete country request received for id: ${id}`);
    const result = await this.softDeleteCountryUsecase.execute(id);
    this.logger.log(`Delete country request completed for id: ${id}`);
    return result;
  }

  async findOne(
    query: QueryFilter<Country>,
  ): Promise<CountryResponseDto | null> {
    this.logger.log(
      `Find one country request received with query: ${JSON.stringify(query)}`,
    );
    const result = await this.findOneCountryUsecase.execute(query);
    this.logger.log('Find one country request completed');
    return result;
  }

  async update(
    id: string,
    updateCountryDto: UpdateCountryDto,
  ): Promise<CountryResponseDto> {
    this.logger.log(`Update country request received for id: ${id}`);
    const result = await this.updateCountryUsecase.execute(
      id,
      updateCountryDto,
    );
    this.logger.log(`Update country request completed for id: ${id}`);
    return result;
  }
}
