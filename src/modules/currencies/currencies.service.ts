import { Injectable } from '@nestjs/common';
import { CreateCurrencyDto } from './dtos/create-currency.dto';
import { CurrencyResponseDto } from './dtos/currency-response.dto';
import { CreateCurrencyUsecase } from './use-cases/create-currency.usecase';
import { FindCurrencyByIdUsecase } from './use-cases/find-currency-by-id.usecase';
import { FindAllCurrenciesUsecase } from './use-cases/find-all-currencies.usecase';
import { FindAllDto } from './dtos/find-all-currencies.dto';
import { PaginatedResult } from '@common/data-access';
import { UpdateCurrencyUsecase } from './use-cases/update-currency.usecase';
import { UpdateCurrencyDto } from './dtos/update-currency.dto';
import { SoftDeleteCurrencyUsecase } from './use-cases/soft-delete-currency.usecase';

@Injectable()
export class CurrenciesService {
  constructor(
    private readonly createCurrencyUsecase: CreateCurrencyUsecase,
    private readonly findCurrencyByIdUsecase: FindCurrencyByIdUsecase,
    private readonly findAllCurrenciesUsecase: FindAllCurrenciesUsecase,
    private readonly updateCurrencyUsecase: UpdateCurrencyUsecase,
    private readonly softDeleteCurrencyUsecase: SoftDeleteCurrencyUsecase,
  ) {}

  async createCurrency(
    createCurrencyDto: CreateCurrencyDto,
  ): Promise<CurrencyResponseDto> {
    return this.createCurrencyUsecase.execute(createCurrencyDto);
  }

  async getCurrencyById(id: string): Promise<CurrencyResponseDto> {
    return this.findCurrencyByIdUsecase.execute(id);
  }

  async findAll(
    query: FindAllDto,
  ): Promise<PaginatedResult<CurrencyResponseDto>> {
    return this.findAllCurrenciesUsecase.execute(query);
  }

  async updateById(
    id: string,
    body: UpdateCurrencyDto,
  ): Promise<CurrencyResponseDto> {
    return this.updateCurrencyUsecase.execute(id, body);
  }

  async deleteById(id: string): Promise<CurrencyResponseDto> {
    return this.softDeleteCurrencyUsecase.execute(id);
  }
}
