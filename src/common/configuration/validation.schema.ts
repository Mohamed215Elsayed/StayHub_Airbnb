/**
 * Runtime configuration validation using Joi.
 *
 * This schema validates all required environment variables during
 * application startup (fail-fast approach). If any configuration is
 * missing or invalid, the application will not start and will throw
 * a clear validation error.
 *
 * Example:
 * ❌ Config validation error: "JWT_SECRET" is required
 *
 * This helps detect configuration issues early instead of allowing
 * the application to fail later with unexpected runtime errors.
 */
import * as Joi from 'joi';
import { Environment } from './environment.enum';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid(...Object.values(Environment))
    .default(Environment.Development),
  PORT: Joi.number().default(5000),
  fallbackLanguage: Joi.string().default('ar'),
  MONGO_URI: Joi.string().required().messages({
    'any.required': 'MONGO_URI is required',
  }),
  JWT_SECRET: Joi.string().required().messages({
    'any.required': 'JWT_SECRET is required',
  }),
  ACCESS_TOKEN_EXPIRE_IN: Joi.string().required().messages({
    'any.required': 'ACCESS_TOKEN_EXPIRE_IN is required',
  }),
  REFRESH_TOKEN_EXPIRE_IN: Joi.string().required().messages({
    'any.required': 'REFRESH_TOKEN_EXPIRE_IN is required',
  }),
});
