/**
 * Variable declarations only — no logic or values.
 * Used solely for type safety, IDE autocomplete, and to prevent
 * errors caused by incorrect variable names.
 *
 * ❌ This does not perform any runtime validation.
 * It only provides compile-time type checking and editor assistance.
 */
// import { Environment } from './environment.enum';
export interface EnvironmentVariables {
  // NODE_ENV: Environment;
  PORT: number;
  fallbackLanguage: string;
}