import { EnvironmentVariables } from '../environment.interface';
import { Environment } from '../environment.enum';
import { defaultEnv } from './default.env';

export const developmentEnv = (): EnvironmentVariables => ({
  ...defaultEnv(),
  NODE_ENV: Environment.Development,
  PORT: parseInt(process.env.PORT ?? '3001', 10),
  LOG_LEVEL: process.env.LOG_LEVEL ?? 'debug',
  MONGO_URI: process.env.MONGO_URI ?? 'mongodb://localhost:27018/airbnbDB?replicaSet=rs0',
  JWT_SECRET: process.env.JWT_SECRET ?? 'dev_jwt_secret_change_me',
  ACCESS_TOKEN_EXPIRE_IN: process.env.ACCESS_TOKEN_EXPIRE_IN ?? '7d',
  REFRESH_TOKEN_EXPIRE_IN: process.env.REFRESH_TOKEN_EXPIRE_IN ?? '30d',
  SMTP: {
    host: process.env.SMTP_HOST ?? 'localhost',
    port: Number(process.env.SMTP_PORT ?? 1025),
    secure: process.env.SMTP_SECURE === 'true',
    service: process.env.SMTP_SERVICE ?? '',
    from: process.env.SMTP_FROM ?? '"StayHub Dev" <no-reply@stayhub.local>',
    auth:
      process.env.SMTP_AUTH_EMAIL && process.env.SMTP_AUTH_PASS
        ? {
            user: process.env.SMTP_AUTH_EMAIL,
            pass: process.env.SMTP_AUTH_PASS,
          }
        : undefined,
  },
});
