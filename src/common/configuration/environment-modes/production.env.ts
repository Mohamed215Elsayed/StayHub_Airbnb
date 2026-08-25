import { EnvironmentVariables } from '../environment.interface';
import { Environment } from '../environment.enum';
import { defaultEnv } from './default.env';

export const productionEnv = (): EnvironmentVariables => ({
  ...defaultEnv(),
  NODE_ENV: Environment.Production,
  PORT: parseInt(process.env.PORT ?? '5001', 10),
  LOG_LEVEL: process.env.LOG_LEVEL ?? 'warn',
  MONGO_URI:
    process.env.MONGO_URI ?? 'mongodb://localhost:27019/airbnbDB_prod',
  JWT_SECRET: process.env.JWT_SECRET ?? 'production_jwt_secret_change_me',
  ACCESS_TOKEN_EXPIRE_IN: process.env.ACCESS_TOKEN_EXPIRE_IN ?? '15m',
  REFRESH_TOKEN_EXPIRE_IN: process.env.REFRESH_TOKEN_EXPIRE_IN ?? '7d',
  SMTP: {
    host: process.env.SMTP_HOST ?? 'smtp.production.stayhub.com',
    port: Number(process.env.SMTP_PORT ?? 465),
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
