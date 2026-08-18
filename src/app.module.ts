import { Module } from '@nestjs/common';
import { CoreModule } from './core.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { CountriesModule } from './modules/countries/countries.module';
import { CitiesModule } from './modules/cities/cities.module';
import { CurrenciesModule } from '@modules/currencies/currencies.module';

@Module({
  imports: [
    CoreModule,
    UsersModule,
    AuthModule,
    CountriesModule,
    CitiesModule,
    CurrenciesModule,
  ],
  providers: [],
})
export class AppModule {}
