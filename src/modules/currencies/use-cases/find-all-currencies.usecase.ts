import { Injectable } from '@nestjs/common';
import { CurrencyRepository } from '../repository/currency.repository';
import { FindAllDto } from '../dtos/find-all-currencies.dto';
import { PaginatedResult } from '@common/data-access';
import { CurrencyResponseDto } from '../dtos/currency-response.dto';
import { QueryFilter } from 'mongoose';
import { Currency } from '../schema/currency.schema';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class FindAllCurrenciesUsecase {
  constructor(private readonly currencyRepository: CurrencyRepository) {}

  async execute(
    query: FindAllDto,
  ): Promise<PaginatedResult<CurrencyResponseDto>> {
    const matchQuery: QueryFilter<Currency> = {
      isDeleted: false,
    };

    if (query?.name) matchQuery.name = { $regex: query.name, $options: 'i' };
    if (query?.currencyCode) matchQuery.currencyCode = query.currencyCode;

    const result = await this.currencyRepository.findPaginated(matchQuery, {
      page: query?.page,
      limit: query?.limit,
      ignoreLimit: query?.ignoreLimit,
      lean: true,
    });

    return new PaginatedResult(
      plainToInstance(CurrencyResponseDto, result.data, {
        excludeExtraneousValues: true,
      }),
      result.totalCount,
      result.page,
      result.limit,
    );
  }
}
