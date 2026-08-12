import { EnvironmentVariables } from '../environment.interface';
import { Environment } from '../environment.enum';
import { defaultEnv } from './default.env';

export const productionEnv = (): EnvironmentVariables => ({
  ...defaultEnv(),
  NODE_ENV: Environment.Production,
  PORT: parseInt(process.env.PORT ?? '3001', 10),
  fallbackLanguage: process.env.fallbackLanguage ?? 'ar',
  MONGO_URI: process.env.MONGO_URI ?? 'mongodb://localhost:27017/airbnbDB',
  JWT_SECRET: process.env.JWT_SECRET ?? 'JWT_SECRET',
  ACCESS_TOKEN_EXPIRE_IN: process.env.ACCESS_TOKEN_EXPIRE_IN ?? '15m',
  REFRESH_TOKEN_EXPIRE_IN: process.env.REFRESH_TOKEN_EXPIRE_IN ?? '7d',
});
