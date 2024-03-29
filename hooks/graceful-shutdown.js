import configuration from '../configuration/index.js';
import cron from '../utilities/cron.js';
import database from '../database/index.js';
import { ENVS } from '../constants/index.js';
import logger from '../utilities/logger.js';
import rc from '../redis/index.js';
import '../types.js';

/**
 * Graceful shutdown triggered when Fastify server is closing
 * @returns {Promise<void>}
 */
export default async function gracefulShutdown() {
  if (database.client) {
    await database.client.close();
    logger('MongoDB connection closed');
  }
  if (rc.client && rc.client.isOpen) {
    await rc.client.quit();
    logger('Redis connection closed');
  }
  if (configuration.APP_ENV !== ENVS.testing) {
    cron.stop();
  }
  process.exit(0);
}
