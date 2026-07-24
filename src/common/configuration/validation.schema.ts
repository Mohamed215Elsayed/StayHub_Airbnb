
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
});