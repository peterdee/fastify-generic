import redis from 'redis';

import configuration from '../configuration/index.js';
import { ENVS } from '../constants/index.js';
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

  constructor() {
    this.keyFormatter = keyFormatter;
  }

  async connect(redisConnectionString = '') {
    if (!this.client) {
      if (configuration.APP_ENV === ENVS.testing) {
        const { default: redisMock } = await import('redis-mock');
        this.client = redisMock.createClient();
        logger('Redis connected [TESTING]');
      } else {
        this.client = redis.createClient({
          url: redisConnectionString,
        });
        await this.client.connect();
        logger('Redis connected');
      }
    }
  }
}

export default new RedisConnection();
