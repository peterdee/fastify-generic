import logger from './logger.js';
import '../database/types.js';
import '../types.js';

/**
 * Graceful shutdown
 * @param {string} signal
 * @param {FastifyInstance} server
 * @param {DatabaseClient} databaseClient
 * @param {RedisClient} redisClient
 * @returns {Promise<void>}
*/
export default async function gracefulShutdown(
  signal,
  server,
  databaseClient,
  redisClient,
) {
  logger(`Shutting down with a signal ${signal}`);
  if (server) {
    await server.close();
  }
  if (databaseClient) {
    await databaseClient.close();
  }
  if (redisClient) {
    await redisClient.quit();
  }
  process.exit(0);
}
