import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { API_TAGS } from './constant';

export class SwaggerConfig {
  static setup(app: INestApplication): void {
    const config = new DocumentBuilder()
      .setTitle('StayHub Airbnb Clone API')
      .setDescription(
        'RESTful API for the StayHub Airbnb Clone application.\n\n' +
          '**Authentication**\n' +
          'Most endpoints require a Bearer JWT access token. Include it in the `Authorization` ' +
          'header as `Bearer <accessToken>`. Public endpoints are marked accordingly.\n\n' +
          '**Rate Limiting**\n' +
          'API usage may be rate-limited. Please respect throttling limits.\n\n' +
          '**Internationalization**\n' +
          'Error messages can be localized via the `x-lang` header or `lang` query parameter.',
      )
      .setVersion('1.0')
      .setContact('StayHub Team', 'https://stayhub.dev', 'contact@stayhub.dev')
      .setLicense('MIT', 'https://opensource.org/licenses/MIT')
      .addServer('/api')
      .addTag(
        API_TAGS.AUTH,
        'Authentication: register, login, refresh, logout, me',
      )
      .addTag(API_TAGS.USERS, 'User management (admin only)')
      .addTag(API_TAGS.COUNTRIES, 'Country operations')
      .addTag(
        API_TAGS.CITIES,
        'City operations (admin only for write operations)',
      )
      .addTag(
        API_TAGS.CURRENCIES,
        'Currency operations (admin only for write operations)',
      )
      .addTag(
        API_TAGS.UNIT_CATEGORIES,
        'Unit category operations (admin only for write operations)',
      )
      .addTag(API_TAGS.APP_SETTINGS, 'Application settings (admin only)')
      .addTag(API_TAGS.SYSTEM_ADMINS, 'System administrator operations')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'Authorization',
          in: 'header',
          description:
            'Enter the JWT access token. You can obtain one via POST /api/auth/login or POST /api/auth/register.',
        },
        'bearer',
      )
      .build();

    const options: SwaggerDocumentOptions = {
      ignoreGlobalPrefix: false,
      operationIdFactory: (controllerKey: string, methodKey: string) =>
        methodKey,
    };
    const documentFactory = () =>
      SwaggerModule.createDocument(app, config, options);
    SwaggerModule.setup('docs', app, documentFactory, {
      useGlobalPrefix: true,
      jsonDocumentUrl: 'swagger.json',
      swaggerOptions: {
        filter: true,
        displayRequestDuration: true,
        persistAuthorization: true,
        docExpansion: 'none',
        tryItOutEnabled: true,
      },
      customSiteTitle: 'StayHub Airbnb Clone API',
    });
  }
}
