import { ENVS } from './constants/index.js';
import logger from './utilities/logger.js';

(async () => {
  const { APP_ENV = '' } = process.env;
  if (APP_ENV === ENVS.development) {
    const { default: dotenv } = await import('dotenv');
    dotenv.config();
    logger('Loaded .env file');
  }
  return import('./server.js');
})();
