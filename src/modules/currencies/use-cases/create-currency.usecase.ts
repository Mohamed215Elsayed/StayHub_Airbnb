import { Injectable } from '@nestjs/common';
import { CurrencyRepository } from '../repository/currency.repository';
import { CreateCurrencyDto } from '../dtos/create-currency.dto';
import { CurrencyResponseDto } from '../dtos/currency-response.dto';
import { CustomConflictException } from '@common/error-handling/custom-exceptions/conflict.exception';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CreateCurrencyUsecase {
  constructor(private readonly currencyRepository: CurrencyRepository) {}

  async execute(body: CreateCurrencyDto): Promise<CurrencyResponseDto> {
    const existingCurrency = await this.currencyRepository.findOne({
      name: body.name,
      isDeleted: false,
    });

    if (existingCurrency) {
      throw new CustomConflictException('error.CURRENCY_ALREADY_EXISTS');
    }

    const createdCurrency = await this.currencyRepository.create(body);

    return plainToInstance(CurrencyResponseDto, createdCurrency.toObject(), {
      excludeExtraneousValues: true,
    });
  }
}
