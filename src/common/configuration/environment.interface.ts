/**
 * Variable declarations only — no logic or values.
 * Used solely for type safety, IDE autocomplete, and to prevent
 * errors caused by incorrect variable names.
 *
 * ❌ This does not perform any runtime validation.
 * It only provides compile-time type checking and editor assistance.
 */
import { Environment } from './environment.enum';
export interface EnvironmentVariables {
  NODE_ENV: Environment;
  PORT: number;
  fallbackLanguage: string;
  LOG_LEVEL: string;
  MONGO_URI: string;
  JWT_SECRET: string;
  ACCESS_TOKEN_EXPIRE_IN: string;
  REFRESH_TOKEN_EXPIRE_IN: string;
  SYSTEM_ADMIN: ISystemAdmin;
  SMTP: ISmtp;
}

export interface ISmtp {
  host: string;
  port: number;
  secure: boolean;
  service: string;
  from: string;
  auth?: {
    user: string;
    pass: string;
  };
}

export interface ISystemAdmin {
  name: string;
  email: string;
  password: string;
  // role?: string;// 'super-admin' | 'admin' | 'support'
  // phone?: string;
  // isActive: boolean;
  // isVerified: boolean;
  // totpEnabled: boolean;
  // timezone: string;
  // metadata?: Record<string, any>;
}

export interface ISmtp {
  host: string;
  port: number;
  secure: boolean;
  auth?: {
    user: string;
    pass: string;
  };
}
