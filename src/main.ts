import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './common/configuration/environment.interface';
import { AppModule } from './app.module';
import { I18nValidationPipe, I18nMiddleware } from 'nestjs-i18n';
import { SwaggerConfig } from './common/swagger';

async function bootstrap() {
  const app = await NestFactory.create<INestApplication>(AppModule);
  // app.enableCors();
  app.setGlobalPrefix('api');
  const configService = app.get(ConfigService<EnvironmentVariables>);
  const port = configService.getOrThrow<number>('PORT');

  const i18nMiddleware = app.get(I18nMiddleware);
  app.use(i18nMiddleware.use.bind(i18nMiddleware));

  //apply pipes after middlewares
  // To use nestjs-i18n in your DTO validation.json
  app.useGlobalPipes(
    new I18nValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  //apply Global filters and Interceptors
  // app.useGlobalFilters(...);
  // app.useGlobalInterceptors(...);
  
  //Swagger Setup
  SwaggerConfig.setup(app);

  await app.listen(port);
  console.log(`Server started on port: ${port}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
