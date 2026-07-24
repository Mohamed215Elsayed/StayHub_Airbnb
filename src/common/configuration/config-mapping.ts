import { EnvironmentVariables } from './environment.interface';
import { developmentEnv } from './environment-modes/development.env';
import { stagingEnv } from './environment-modes/staging.env';
import { productionEnv } from './environment-modes/production.env';
import { Environment } from './environment.enum';

//We use Record bcause  it is amap
const environments : Record<string, () => EnvironmentVariables> = {
  [Environment.Development]: developmentEnv,//[]=Computed Property Name
  [Environment.Staging]: stagingEnv,//we store the function reference, not the result of calling the function
  [Environment.Production]: productionEnv,// we make this due to we dont know which environment will be used at runtime, so we store the function reference and call it later when needed
};

export default (): EnvironmentVariables => {
  const nodeEnv = (process.env.NODE_ENV as Environment) || Environment.Development;
  const envFunction = environments[nodeEnv];
  if (!envFunction) {
    throw new Error(`Invalid NODE_ENV value: ${nodeEnv}`);
  }
  console.log(`[Configuration] Loading environment: ${nodeEnv}`);
  return envFunction();
};