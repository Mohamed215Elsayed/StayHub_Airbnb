import { API_TAGS } from '@common/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrenciesService } from './currencies.service';
import { CreateCurrencyDto } from './dtos/create-currency.dto';
import { CurrencyResponseDto } from './dtos/currency-response.dto';
import {
  CreateCurrencySwagger,
  DeleteCurrencySwagger,
  FindAllCurrenciesSwagger,
  FindCurrencyByIdSwagger,
  UpdateCurrencySwagger,
} from './swagger';
import { CurrencyIdDto } from './dtos/currency-id.dto';
import { FindAllDto } from './dtos/find-all-currencies.dto';
import { PaginatedResult } from '@common/data-access';
import { UpdateCurrencyDto } from './dtos/update-currency.dto';
import { Authorize } from '@modules/auth/decorators/roles.decorator';
import { Roles } from '@common/constants';

@ApiTags(API_TAGS.CURRENCIES)
@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @CreateCurrencySwagger()
  @Post()
  @Authorize(Roles.SYSTEM_ADMIN)
  async createCurrency(
    @Body() body: CreateCurrencyDto,
  ): Promise<CurrencyResponseDto> {
    return this.currenciesService.createCurrency(body);
  }

  @FindCurrencyByIdSwagger()
  @Get('/:id')
  async getCurrencyById(
    @Param() param: CurrencyIdDto,
  ): Promise<CurrencyResponseDto> {
    return this.currenciesService.getCurrencyById(param.id);
  }

  @FindAllCurrenciesSwagger()
  @Get()
  async findAll(
    @Query() query: FindAllDto,
  ): Promise<PaginatedResult<CurrencyResponseDto>> {
    return this.currenciesService.findAll(query);
  }

  @UpdateCurrencySwagger()
  @Patch('/:id')
  @Authorize(Roles.SYSTEM_ADMIN)
  async update(
    @Param() param: CurrencyIdDto,
    @Body() body: UpdateCurrencyDto,
  ): Promise<CurrencyResponseDto> {
    return this.currenciesService.updateById(param.id, body);
  }

  @DeleteCurrencySwagger()
  @Delete('/:id')
  @Authorize(Roles.SYSTEM_ADMIN)
  async deleteCurrencyById(
    @Param() param: CurrencyIdDto,
  ): Promise<CurrencyResponseDto> {
    return this.currenciesService.deleteById(param.id);
  }
}
