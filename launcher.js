import configuration from './configuration/index.js';
import database from './database/index.js';
import { ENVS } from './constants/index.js';
import gracefulShutdown from './utilities/graceful-shutdown.js';

(async () => {
  const { default: createServer } = await import('./server.js');
  const server = await createServer();

  try {
    await database.connect(
      configuration.DATABASE.connectionString,
      configuration.DATABASE.databaseName,
    );
    await server.listen({ port: configuration.PORT });

    if (configuration.APP_ENV === ENVS.production) {
      process.on('SIGINT', (signal) => gracefulShutdown(signal, server, database.client));
      process.on('SIGTERM', (signal) => gracefulShutdown(signal, server, database.client));
    }
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
})();
