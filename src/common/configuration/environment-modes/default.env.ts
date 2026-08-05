import { EnvironmentVariables } from '../environment.interface';

export const defaultEnv = (): EnvironmentVariables => ({
  PORT: parseInt(process.env.PORT ?? '6000', 10),
  fallbackLanguage: process.env.fallbackLanguage ?? 'ar',
  MONGO_URI: process.env.MONGO_URI ?? 'mongodb://localhost:27017/airbnbDB',
  JWT_SECRET: process.env.JWT_SECRET ?? 'JWT_SECRET',
  ACCESS_TOKEN_EXPIRE_IN: process.env.ACCESS_TOKEN_EXPIRE_IN ?? '1d',
  REFRESH_TOKEN_EXPIRE_IN: process.env.REFRESH_TOKEN_EXPIRE_IN ?? '15d',
});
