import { APP_ENV, DATABASE, PORT } from './configuration/index.js';
import database from './database/index.js';
import { ENVS } from './constants/index.js';
import gracefulShutdown from './utilities/graceful-shutdown.js';

export default async function launch() {
  const { default: createServer } = await import('./server.js');
  const server = await createServer();

  try {
    console.log(DATABASE);
    // await database.connect(DATABASE.connectionString, DATABASE.databaseName);
    await server.listen({ port: PORT });

    if (APP_ENV === ENVS.production) {
      process.on('SIGINT', (signal) => gracefulShutdown(signal, server));
      process.on('SIGTERM', (signal) => gracefulShutdown(signal, server));
    }
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
}
