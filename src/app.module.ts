import { Module } from '@nestjs/common';
import { CoreModule } from './core.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { CountriesModule } from './modules/countries/countries.module';
import { CitiesModule } from './modules/cities/cities.module';
import { CurrenciesModule } from '@modules/currencies/currencies.module';
import { UnitCategoriesModule } from '@modules/unit-categories/unit-categories.module';
import { AppSettingsModule } from '@modules/app-settings/app-settings.module';
import { SystemAdminsModule } from '@modules/system-admins/system-admins.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { MailModule } from './modules/mail/mail.module';
import { OtpModule } from '@modules/otp/otp.module';
import { ForgetPasswordModule } from '@modules/forget-password/forget-password.module';

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
    SystemAdminsModule,
    MailModule,
    OtpModule,
    ForgetPasswordModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
