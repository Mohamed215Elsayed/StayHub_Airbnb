import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './common/configuration/environment.interface';
import { AppModule } from './app.module';
import { I18nValidationPipe, I18nMiddleware } from 'nestjs-i18n';
import { SwaggerConfig } from './common/swagger';
import { PinoLogger } from '@common/interceptors/pino.logger';

async function bootstrap() {
  const app = await NestFactory.create<INestApplication>(AppModule, {
    logger: new PinoLogger(),
  });
  app.setGlobalPrefix('api');
  const configService = app.get(ConfigService<EnvironmentVariables>);
  const port = configService.getOrThrow<number>('PORT');

  const i18nMiddleware = app.get(I18nMiddleware);
  app.use(i18nMiddleware.use.bind(i18nMiddleware));

  app.useGlobalPipes(
    new I18nValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }) as any,
  );

  SwaggerConfig.setup(app);

  app.enableShutdownHooks();
  const logger = app.get(PinoLogger);
  logger.log(`Server started on port: ${port}`);
  await app.listen(port);
}

bootstrap().catch((error) => {
  const logger = new PinoLogger();
  logger.error('Failed to start application', error?.stack);
  process.exit(1);
});
