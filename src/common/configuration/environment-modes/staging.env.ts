import { EnvironmentVariables } from '../environment.interface';
import { Environment } from '../environment.enum';
import { defaultEnv } from './default.env';

export const stagingEnv = (): EnvironmentVariables => ({
    ...defaultEnv(),
    // NODE_ENV: Environment.Staging,
    PORT: parseInt(process.env.PORT ?? '5000', 10),
});