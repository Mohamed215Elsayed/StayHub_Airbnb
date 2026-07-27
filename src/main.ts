import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './common/configuration/environment.interface';
import { AppModule } from './app.module';
import { I18nValidationPipe } from 'nestjs-i18n';

async function bootstrap() {
  const app = await NestFactory.create<INestApplication>(AppModule);

 app.useGlobalPipes(
  new I18nValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);

  const configService = app.get(ConfigService<EnvironmentVariables>);
  const port = configService.getOrThrow<number>('PORT');
  await app.listen(port);
  console.log(`Server started on port: ${port}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});