import logger from './logger.js';

/**
 * Graceful shutdown
 * @param {string} signal termination signal
 * @param {import('fastify').FastifyInstance} server Fastify server
 * @returns {Promise<never>}
*/
export default async function gracefulShutdown(signal, server) {
  logger(`Shutting down with a signal ${signal}`);
  if (server) {
    await server.close();
  }
  process.exit(0);
}
