import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CountriesService } from './countries.service';
import { API_TAGS } from '@common/swagger';
import { ApiTags } from '@nestjs/swagger';
import { CreateCountryDto } from './dtos/create-country.dto';
import { CountryResponseDto } from './dtos/country-response.dto';
import {
  CreateCountrySwagger,
  FindCountryByIdSwagger,
  FindAllCountriesSwagger,
  DeleteCountrySwagger,
  UpdateCountrySwagger,
} from './swagger';
import { CountryIdDto } from './dtos/country-id.dto';
import { FindAllDto } from './dtos/find-all.dto';
import { UpdateCountryDto } from './dtos/update-country.dto';

@ApiTags(API_TAGS.COUNTRIES)
@Controller('countries')
export class CountriesController {
  private readonly logger = new Logger(CountriesController.name);

  constructor(private readonly countriesService: CountriesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CreateCountrySwagger()
  async create(
    @Body() createCountryDto: CreateCountryDto,
  ): Promise<CountryResponseDto> {
    this.logger.log(
      `Creating country with data: ${JSON.stringify(createCountryDto)}`,
    );
    return this.countriesService.create(createCountryDto);
  }

  @FindCountryByIdSwagger()
  @Get('/:id')
  async getCountryById(
    @Param() param: CountryIdDto,
  ): Promise<CountryResponseDto> {
    this.logger.log(`Getting country by id: ${param.id}`);
    return this.countriesService.getCountryById(param.id);
  }

  @FindAllCountriesSwagger()
  @Get()
  async findAll(@Query() query: FindAllDto): Promise<CountryResponseDto[]> {
    this.logger.log('Getting all countries');
    return this.countriesService.findAll(query);
  }

  @DeleteCountrySwagger()
  @Delete('/:id')
  async delete(@Param() param: CountryIdDto): Promise<CountryResponseDto> {
    this.logger.log(`Soft deleting country with id: ${param.id}`);
    return this.countriesService.delete(param.id);
  }

  @UpdateCountrySwagger()
  @Patch('/:id')
  async update(
    @Param() param: CountryIdDto,
    @Body() body: UpdateCountryDto,
  ): Promise<CountryResponseDto> {
    this.logger.log(`Updating country with id: ${param.id}`);
    return this.countriesService.update(param.id, body);
  }
}
