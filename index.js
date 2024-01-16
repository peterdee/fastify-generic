import configuration from './configuration/index.js';
import loadEnvFile from './utilities/load-env-file.js';
import logger from './utilities/logger.js';

(() => {
  const parsed = loadEnvFile();
  configuration.init(parsed);
  logger(`Loaded .env file [${parsed.APP_ENV.toUpperCase()}]`);

  return import('./launcher.js');
})();
