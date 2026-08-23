import { Module } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CitiesController } from './cities.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CitySchema } from './schema/city.schema';
import { CountriesModule } from '@modules/countries/countries.module';
import { ModelNames } from '@common/data-access';
import { CreateCityUsecase } from './use-cases/create-city.usecase';
import { CityRepository } from './repository/city.repository';
import { FindAllCitiesUsecase } from './use-cases/find-all-cities.usecase';
import { UpdateCityUsecase } from './use-cases/update-city.usecase';
import { FindOneUsecase } from './use-cases/find-one.usecase';
import { FindCityByIdUsecase } from './use-cases/find-city-by-id.usecase';
import { SoftDeleteCityUsecase } from './use-cases/soft-delete-city.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModelNames.CITIES, schema: CitySchema },
    ]),
    CountriesModule,
  ],
  controllers: [CitiesController],
  providers: [
    CitiesService,
    CreateCityUsecase,
    CityRepository,
    FindAllCitiesUsecase,
    UpdateCityUsecase,
    FindOneUsecase,
    FindCityByIdUsecase,
    SoftDeleteCityUsecase,
  ],
  exports: [],
})
export class CitiesModule {}
