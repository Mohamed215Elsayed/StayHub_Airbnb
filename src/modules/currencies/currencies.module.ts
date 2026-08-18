import { Module } from '@nestjs/common';
import { CurrencySchema } from './schema/currency.schema';
import { ModelNames } from '@common/data-access';
import { MongooseModule } from '@nestjs/mongoose';
import { CurrenciesController } from './currencies.controller';
import { CurrenciesService } from './currencies.service';
import { CurrencyRepository } from './repository/currency.repository';
import { CreateCurrencyUsecase } from './use-cases/create-currency.usecase';
import { FindCurrencyByIdUsecase } from './use-cases/find-currency-by-id.usecase';
import { FindAllCurrenciesUsecase } from './use-cases/find-all-currencies.usecase';
import { UpdateCurrencyUsecase } from './use-cases/update-currency.usecase';
import { SoftDeleteCurrencyUsecase } from './use-cases/soft-delete-currency.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModelNames.CURRENCIES, schema: CurrencySchema },
    ]),
  ],
  controllers: [CurrenciesController],
  providers: [
    CurrenciesService,
    CurrencyRepository,
    CreateCurrencyUsecase,
    FindCurrencyByIdUsecase,
    FindAllCurrenciesUsecase,
    UpdateCurrencyUsecase,
    SoftDeleteCurrencyUsecase
  ],
  exports: [CurrenciesService, CurrencyRepository],
})
export class CurrenciesModule { }
