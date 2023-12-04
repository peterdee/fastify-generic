import { ENVS } from './constants/index.js';
import gracefulShutdown from './utilities/graceful-shutdown.js';
import logger from './utilities/logger.js';

(async () => {
  const { APP_ENV = '' } = process.env;
  if (APP_ENV === ENVS.development) {
    const { default: dotenv } = await import('dotenv');
    dotenv.config();
    logger('Loaded .env file');
  }
  const { default: createServer } = await import('./server.js');
  const server = await createServer();

  process.on('SIGINT', (signal) => gracefulShutdown(signal, server));
  process.on('SIGTERM', (signal) => gracefulShutdown(signal, server));
})();
