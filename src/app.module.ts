import { Module } from '@nestjs/common';
import { CoreModule } from './core.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { CountriesModule } from './modules/countries/countries.module';
import { CitiesModule } from './modules/cities/cities.module';
import { CurrenciesModule } from '@modules/currencies/currencies.module';
import { UnitCategoriesModule } from '@modules/unit-categories/unit-categories.module';
import { AppSettingsModule } from '@modules/app-settings/app-settings.module';

@Module({
  imports: [
    CoreModule,
    UsersModule,
    AuthModule,
    CountriesModule,
    CitiesModule,
    CurrenciesModule,
    UnitCategoriesModule,
    AppSettingsModule,
  ],
  providers: [],
})
export class AppModule {}
