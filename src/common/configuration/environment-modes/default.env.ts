import { EnvironmentVariables } from '../environment.interface';
// import { Environment } from '../environment.enum';

export const defaultEnv = (): EnvironmentVariables => ({
    // NODE_ENV: (process.env.NODE_ENV as Environment) ?? Environment.Development,
    PORT: parseInt(process.env.PORT ?? '5000', 10),
});