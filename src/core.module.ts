import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

import { validationSchema } from './common/configuration/validation.schema';
import { Environment } from './common/configuration/environment.enum';
import configMapping from './common/configuration/config-mapping';

import {
  I18nModule,
  I18nJsonLoader,
  QueryResolver,
  HeaderResolver,
  AcceptLanguageResolver,
} from 'nestjs-i18n';
import { EnvironmentVariables } from '@common/configuration/environment.interface';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomI18nService } from './i18n/custom-i18n.service';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CustomExceptionFilter } from '@common/error-handling/filters/custom-exception.filter';
import { LoggerInterceptor } from '@common/interceptors';
import { PinoLogger } from '@common/interceptors';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        '.env',
        `.env.${process.env.NODE_ENV || Environment.Development}`,
      ],
      load: [configMapping],
      validationSchema,
    }),
    I18nModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvironmentVariables>) => ({
        fallbackLanguage: configService.getOrThrow('fallbackLanguage'),
        loader: I18nJsonLoader,
        loaderOptions: {
          path: join(__dirname, '/i18n/'),
          watch: true,
        },
      }),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        new HeaderResolver(['x-lang']),
        AcceptLanguageResolver,
      ],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvironmentVariables>) => ({
        uri: configService.getOrThrow('MONGO_URI'),
      }),
    }),
  ],
  providers: [
    CustomI18nService,
    PinoLogger,
    { provide: APP_FILTER, useClass: CustomExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggerInterceptor },
  ],
  exports: [I18nModule, CustomI18nService, PinoLogger],
})
export class CoreModule {}
