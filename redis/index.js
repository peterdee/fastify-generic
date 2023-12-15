import redis from 'redis';

import logger from '../utilities/logger.js';
import '../types.js';

class RedisConnection {
  /** @type {RedisClient} */
  client = null;

  async connect(redisConnectionString = '') {
    this.client = redis.createClient({
      url: redisConnectionString,
    });
    await this.client.connect();
    logger('Redis connected');
  }
}

export default new RedisConnection();
