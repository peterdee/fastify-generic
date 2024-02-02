import configuration from './configuration/index.js';
import loadEnvFile from './utilities/load-env-file.js';

(() => {
  const { ENV_VARIABLES_ORIGIN = '' } = process.env;
  if (ENV_VARIABLES_ORIGIN !== 'env') {
    configuration.init(loadEnvFile());
  } else {
    configuration.init(process.env);
  }

  return import('./launcher.js');
})();
