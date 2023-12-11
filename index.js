import { ENVS } from './constants/index.js';
import logger from './utilities/logger.js';

(async () => {
  const { APP_ENV = '' } = process.env;
  if (APP_ENV !== ENVS.production) {
    const { default: dotenv } = await import('dotenv');
    dotenv.config();
    logger('Loaded .env file', process.env);
  }

  const { default: launch } = await import('./launcher.js');
  return launch();
})();
