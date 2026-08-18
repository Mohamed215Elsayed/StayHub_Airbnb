import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CitiesService } from './cities.service';
import { ApiTags } from '@nestjs/swagger';
import { API_TAGS } from '@common/swagger';
import { CreateCityDto } from './dtos/create-city.dto';
import { CityResponseDto } from './dtos/city-response.dto';
import {
  CreateCitySwagger,
  DeleteCitySwagger,
  FindCityByIdSwagger,
} from './swagger';
import { FindAllCitiesDto } from './dtos/find-all-cities.dto';
import { PaginatedResult } from '@common/data-access';
import { FindAllCitiesSwagger } from './swagger/find-all-cities.swagger';
import { UpdateCitySwagger } from './swagger/update-city.swagger';
import { UpdateCityDto } from './dtos/update-city.dto';

@ApiTags(API_TAGS.CITIES)
@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @CreateCitySwagger()
  @Post()
  async createCity(@Body() body: CreateCityDto): Promise<CityResponseDto> {
    return this.citiesService.createCity(body);
  }

  @FindAllCitiesSwagger()
  @Get()
  async findAllCities(
    @Query() query: FindAllCitiesDto,
  ): Promise<PaginatedResult<CityResponseDto>> {
    return this.citiesService.findAllCities(query);
  }

  @UpdateCitySwagger()
  @Patch('/:id')
  async updateCity(
    @Param('id') cityId: string,
    @Body() body: UpdateCityDto,
  ): Promise<CityResponseDto> {
    return this.citiesService.updateCity(cityId, body);
  }

  @FindCityByIdSwagger()
  @Get('/:id')
  async findCityById(@Param('id') cityId: string): Promise<CityResponseDto> {
    return this.citiesService.findCityById(cityId);
  }

  @DeleteCitySwagger()
  @Delete('/:id')
  async deleteCity(@Param('id') cityId: string): Promise<CityResponseDto> {
    return this.citiesService.deleteCity(cityId);
  }
}
