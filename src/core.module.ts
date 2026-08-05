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
})
export class CoreModule {}
