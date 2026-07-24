import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './common/configuration/validation.schema';
import { Environment } from './common/configuration/environment.enum';
import configMapping from './common/configuration/config-mapping';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: `.env.${process.env.NODE_ENV || Environment.Development}`,
    load: [configMapping],
    validationSchema: validationSchema,
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
