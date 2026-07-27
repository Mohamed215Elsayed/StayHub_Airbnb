import { EnvironmentVariables } from '../environment.interface';
// import { Environment } from '../environment.enum';
import { defaultEnv } from './default.env';

export const developmentEnv = (): EnvironmentVariables => ({
    ...defaultEnv(),
    // NODE_ENV: Environment.Development,
    PORT: parseInt(process.env.PORT ?? '6000', 10),
});
// import { defaultEnv } from './default.env';
// export const developmentEnv = defaultEnv;