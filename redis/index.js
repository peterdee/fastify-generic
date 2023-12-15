import redis from 'redis';

import keyFormatter from '../utilities/key-formatter.js';
import logger from '../utilities/logger.js';
import '../types.js';

class RedisConnection {
  /** @type {RedisClient} */
  client = null;

  /** @type {(prefix: string, ...values: unknown) => string} */
  keyFormatter;

  prefixes = {
    secret: 'secret',
  };

  async connect(redisConnectionString = '') {
    this.client = redis.createClient({
      url: redisConnectionString,
    });
    await this.client.connect();
    logger('Redis connected');
    this.keyFormatter = keyFormatter;
  }
}

export default new RedisConnection();
