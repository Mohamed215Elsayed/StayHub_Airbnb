import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { CustomExceptionFilter } from '@common/error-handling/filters/custom-exception.filter';
import { CustomI18nService } from './i18n/custom-i18n.service';
import { CoreModule } from './core.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [CoreModule, UsersModule, AuthModule],
  providers: [
    CustomI18nService,
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
  ],
})
export class AppModule {}
