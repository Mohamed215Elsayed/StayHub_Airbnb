import { Injectable } from '@nestjs/common';
import { CurrencyRepository } from '../repository/currency.repository';
import { CurrencyResponseDto } from '../dtos/currency-response.dto';
import { CustomNotFoundException } from '@common/error-handling/custom-exceptions/not-found.exception';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class FindCurrencyByIdUsecase {
  constructor(private readonly currencyRepository: CurrencyRepository) {}

  async execute(currencyId: string): Promise<CurrencyResponseDto> {
    const currency = await this.currencyRepository.findOne({
      _id: currencyId,
      isDeleted: false,
    });

    if (!currency) {
      throw new CustomNotFoundException('error.CURRENCY_NOT_FOUND');
    }

    return plainToInstance(CurrencyResponseDto, currency, {
      excludeExtraneousValues: true,
    });
  }
}
