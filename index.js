import { ENVS } from './constants/index.js';
import gracefulShutdown from './utilities/graceful-shutdown.js';
import logger from './utilities/logger.js';
import { PORT } from './configuration/index.js';

(async () => {
  const { APP_ENV = '' } = process.env;
  if (APP_ENV === ENVS.development) {
    const { default: dotenv } = await import('dotenv');
    dotenv.config();
    logger('Loaded .env file');
  }
  const { default: createServer } = await import('./server.js');
  const server = await createServer();

  try {
    await server.listen({ port: PORT });

    if (APP_ENV === ENVS.production) {
      process.on('SIGINT', (signal) => gracefulShutdown(signal, server));
      process.on('SIGTERM', (signal) => gracefulShutdown(signal, server));
    }
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
})();
