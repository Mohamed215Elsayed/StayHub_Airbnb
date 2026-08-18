import { Injectable } from '@nestjs/common';
import { CurrencyRepository } from '../repository/currency.repository';
import { UpdateCurrencyDto } from '../dtos/update-currency.dto';
import { CurrencyResponseDto } from '../dtos/currency-response.dto';
import { CustomNotFoundException } from '@common/error-handling/custom-exceptions/not-found.exception';
import { CustomConflictException } from '@common/error-handling/custom-exceptions/conflict.exception';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UpdateCurrencyUsecase {
  constructor(private readonly currencyRepository: CurrencyRepository) {}

  async execute(
    currencyId: string,
    body: UpdateCurrencyDto,
  ): Promise<CurrencyResponseDto> {
    const currency = await this.currencyRepository.findOne({
      _id: currencyId,
      isDeleted: false,
    });

    if (!currency) {
      throw new CustomNotFoundException('error.CURRENCY_NOT_FOUND');
    }

    if (body?.name) {
      const existingCurrency = await this.currencyRepository.findOne({
        name: body.name,
        isDeleted: false,
        _id: { $ne: currencyId },
      });

      if (existingCurrency) {
        throw new CustomConflictException('error.CURRENCY_ALREADY_EXISTS');
      }
    }

    const updatedCurrency = await this.currencyRepository.findByIdAndUpdate(
      currencyId,
      body,
    );

    if (!updatedCurrency) {
      throw new CustomNotFoundException('error.CURRENCY_NOT_FOUND');
    }

    return plainToInstance(CurrencyResponseDto, updatedCurrency.toObject(), {
      excludeExtraneousValues: true,
    });
  }
}
