import database from '../database/index.js';
import logger from '../utilities/logger.js';
import rc from '../redis/index.js';
import '../types.js';

/**
 * Graceful shutdown triggered by server termination
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
}
