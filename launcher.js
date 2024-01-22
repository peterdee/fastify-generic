import cluster from 'node:cluster';
import os from 'node:os';

import configuration from './configuration/index.js';
import cron from './utilities/cron.js';
import database from './database/index.js';
import { ENVS } from './constants/index.js';
import logger from './utilities/logger.js';
import rc from './redis/index.js';

(async () => {
  await Promise.all([
    database.connect({
      APP_ENV: configuration.APP_ENV,
      connectionString: configuration.DATABASE.connectionString,
      databaseName: configuration.DATABASE.databaseName,
    }),
    rc.connect({
      APP_ENV: configuration.APP_ENV,
      connectionString: configuration.APP_ENV === ENVS.testing
        ? configuration.REDIS_TEST_CONNECTION_STRING
        : configuration.REDIS_CONNECTION_STRING,
      flushOnStartup: configuration.REDIS_FLUSH_ON_STARTUP,
    }),
  ]);

  const { default: createServer } = await import('./server.js');

  const server = await createServer(configuration.APP_ENV);
  try {
    if (configuration.USE_CLUSTER) {
      if (cluster.isPrimary) {
        for (let i = 0; i < os.availableParallelism(); i += 1) {
          cluster.fork({ workerId: i });
        }
      } else {
        await server.listen({ port: configuration.PORT });
        if (process.workerId === 0) {
          logger(
            `Launched the server on port ${configuration.PORT} [APP_ENV: ${
              configuration.APP_ENV.toUpperCase()
            }]`,
          );
        }
      }
    } else {
      await server.listen({ port: configuration.PORT });
      logger(
        `Launched the server on port ${configuration.PORT} [APP_ENV: ${
          configuration.APP_ENV.toUpperCase()
        }]`,
      );
    }

    if (configuration.APP_ENV !== ENVS.testing) {
      cron.start();
    }
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
})();
