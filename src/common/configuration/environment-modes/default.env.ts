import { Environment } from '../environment.enum';
import { EnvironmentVariables } from '../environment.interface';

export const defaultEnv = (): EnvironmentVariables => ({
  NODE_ENV: Environment.Development,
  PORT: parseInt(process.env.PORT ?? '3001', 10),
  fallbackLanguage: process.env.fallbackLanguage ?? 'ar',
  LOG_LEVEL: process.env.LOG_LEVEL ?? 'debug',
  MONGO_URI: process.env.MONGO_URI ?? 'mongodb://localhost:27018/airbnbDB',
  JWT_SECRET: process.env.JWT_SECRET ?? 'JWT_SECRET',
  ACCESS_TOKEN_EXPIRE_IN: process.env.ACCESS_TOKEN_EXPIRE_IN ?? '7d',
  REFRESH_TOKEN_EXPIRE_IN: process.env.REFRESH_TOKEN_EXPIRE_IN ?? '30d',
  SYSTEM_ADMIN: {
    name: process.env.SYSTEM_ADMIN_NAME as string,
    email: process.env.SYSTEM_ADMIN_EMAIL as string,
    password: process.env.SYSTEM_ADMIN_PASSWORD as string,
  },
  SMTP: {
    host: process.env.SMTP_HOST ?? 'localhost',
    port: Number(process.env.SMTP_PORT ?? 1025),
    secure: process.env.SMTP_SECURE === 'true',
    service: process.env.SMTP_SERVICE ?? '',
    from: process.env.SMTP_FROM ?? '"StayHub" <no-reply@stayhub.com>',
    auth:
      process.env.SMTP_AUTH_EMAIL && process.env.SMTP_AUTH_PASS
        ? {
            user: process.env.SMTP_AUTH_EMAIL,
            pass: process.env.SMTP_AUTH_PASS,
          }
        : undefined,
  },
});
