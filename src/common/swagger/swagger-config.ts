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
      .setTitle('Airbnb Clone API')
      .setDescription('This is the apis for airbnb clone')
      .setVersion('1.0')
      .addTag(API_TAGS.AUTH)
      .addTag(API_TAGS.USERS)
      .addTag(API_TAGS.COUNTRIES)
      .addTag(API_TAGS.CITIES)
      .addTag(API_TAGS.CURRENCIES)
      .addTag(API_TAGS.UNIT_CATEGORIES)
      .addBearerAuth()
      .build();

    const options: SwaggerDocumentOptions = {
      ignoreGlobalPrefix: false,
      operationIdFactory: (controllerKey: string, methodKey: string) =>
        methodKey,
      // deepScanRoutes: true, // لو عندك Modules جوه Modules
    };
    const documentFactory = () =>
      SwaggerModule.createDocument(app, config, options);
    SwaggerModule.setup('docs', app, documentFactory, {
      useGlobalPrefix: true, // هضيف /api تلقائياً قدام docs
      jsonDocumentUrl: 'swagger.json', // هيبقى تحت /api/swagger.json
      swaggerOptions: {
        filter: true,
        displayRequestDuration: true, // إظهار وقت استجابة الـ API بعد التجربة,
        // persistAuthorization: true, // (اختياري) يحتفظ بالـ Token بعد تحديث الصفحة
        // docExpansion: 'none', // (اختياري) يطوي كل الـ Endpoints في البداية عشان المنظر يكون نضيف
        // tryItOutEnabled: true, // (اختياري) يفعّل زر التجربة مباشرة
      },
      //   customCss: `
      //   .topbar-wrapper img { content: url('https://your-logo-url.com/logo.png'); }
      //   .topbar-wrapper .link { display: flex; align-items: center; }
      // `,
      //   customSiteTitle: 'Airbnb Clone API - StayHub',
    });
  }
}
