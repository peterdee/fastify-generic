import redis from 'redis';

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

  async connect({
    APP_ENV = ENVS.development,
    connectionString = '',
  }) {
    if (!this.client) {
      this.client = redis.createClient({ url: connectionString });
      await this.client.connect();
      logger(`Redis connected [${APP_ENV.toUpperCase()}]`);
    }
  }
}

export default new RedisConnection();
