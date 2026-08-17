import { Module } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { CreateCountryUsecase } from './use-cases/create-country.usecase';
import { FindCountryByIdUsecase } from './use-cases/find-country-by-id.usecase';
import { FindAllCountriesUsecase } from './use-cases/find-all-countries.usecase';
import { CountrySchema } from './schemas/country.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { SoftDeleteCountryUsecase } from './use-cases/soft-delete-country.usecase';
import { FindOneCountryUsecase } from './use-cases/find-one-country.usecase';
import { UpdateCountryUsecase } from './use-cases/update-country.usecase';
import { ModelNames } from '@common/data-access';
import { CountryRepository } from './repository/country.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModelNames.COUNTRIES, schema: CountrySchema },
    ]),
  ],
  controllers: [CountriesController],
  providers: [
    CountryRepository,
    CountriesService,
    CreateCountryUsecase,
    FindCountryByIdUsecase,
    FindAllCountriesUsecase,
    SoftDeleteCountryUsecase,
    FindOneCountryUsecase,
    UpdateCountryUsecase,
  ],
  exports: [CountryRepository],
})
export class CountriesModule {}
