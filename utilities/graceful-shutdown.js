import logger from './logger.js';
import '../database/types.js';
import '../types.js';

/**
 * Graceful shutdown
 * @param {string} signal
 * @param {FastifyInstance} server
 * @param {DatabaseClient} databaseClient
 * @returns {Promise<void>}
*/
export default async function gracefulShutdown(signal, server, databaseClient) {
  logger(`Shutting down with a signal ${signal}`);
  if (server) {
    await server.close();
  }
  if (databaseClient) {
    await databaseClient.close();
  }
  process.exit(0);
}
