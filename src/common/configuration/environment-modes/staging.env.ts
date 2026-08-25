import { EnvironmentVariables } from '../environment.interface';
import { Environment } from '../environment.enum';
import { defaultEnv } from './default.env';

export const stagingEnv = (): EnvironmentVariables => ({
  ...defaultEnv(),
  NODE_ENV: Environment.Staging,
  PORT: parseInt(process.env.PORT ?? '4001', 10),
  LOG_LEVEL: process.env.LOG_LEVEL ?? 'info',
  MONGO_URI:
    process.env.MONGO_URI ?? 'mongodb://localhost:27018/airbnbDB_staging',
  JWT_SECRET: process.env.JWT_SECRET ?? 'staging_jwt_secret_change_me',
  ACCESS_TOKEN_EXPIRE_IN: process.env.ACCESS_TOKEN_EXPIRE_IN ?? '1d',
  REFRESH_TOKEN_EXPIRE_IN: process.env.REFRESH_TOKEN_EXPIRE_IN ?? '15d',
  SMTP: {
    host: process.env.SMTP_HOST ?? 'smtp.staging.stayhub.com',
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === 'true',
    service: process.env.SMTP_SERVICE ?? '',
    from:
      process.env.SMTP_FROM ??
      '"StayHub Staging" <no-reply@staging.stayhub.com>',
    auth:
      process.env.SMTP_AUTH_EMAIL && process.env.SMTP_AUTH_PASS
        ? {
            user: process.env.SMTP_AUTH_EMAIL,
            pass: process.env.SMTP_AUTH_PASS,
          }
        : undefined,
  },
});
