import logger from './logger.js';
import '../types.js';

/**
 * Graceful shutdown
 * @param {string} signal
 * @param {FastifyInstance} server
 * @returns {Promise<void>}
*/
export default async function gracefulShutdown(signal, server) {
  logger(`Shutting down with a signal ${signal}`);
  if (server) {
    await server.close();
  }
  process.exit(0);
}
