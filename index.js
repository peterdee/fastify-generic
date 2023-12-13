import configuration from './configuration/index.js';
import { ENVS } from './constants/index.js';
import logger from './utilities/logger.js';

(async () => {
  const { APP_ENV = '' } = process.env;
  if (APP_ENV !== ENVS.production) {
    const { default: dotenv } = await import('dotenv');
    const { error, parsed } = dotenv.config();
    if (error) {
      throw error;
    }
    if (parsed && !('APP_ENV' in parsed)) {
      parsed.APP_ENV = APP_ENV;
    }
    configuration.init(parsed);
    logger('Loaded .env file');
  }

  return import('./launcher.js');
})();
