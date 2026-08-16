import { Module } from '@nestjs/common';
import { CoreModule } from './core.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { CountriesModule } from './modules/countries/countries.module';

@Module({
  imports: [CoreModule, UsersModule, AuthModule, CountriesModule],
  providers: [],
})
export class AppModule {}
