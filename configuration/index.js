import * as constants from '../constants/index.js';

class Configuration {
  static ACCESS_TOKEN_EXPIRATION_SECONDS;

  static ACCESS_TOKEN_SECRET;

  static APP_ENV;

  static DATABASE;

  static PORT;

  static REDIS;

  static REDIS_TEST;

  static REFRESH_TOKEN_EXPIRATION_SECONDS;

  static REFRESH_TOKEN_SECRET;

  static #initialized = false;

  static init(parsed = {}) {
    if (!this.#initialized) {
      this.ACCESS_TOKEN_EXPIRATION_SECONDS = Number(parsed.ACCESS_TOKEN_EXPIRATION_SECONDS)
        || constants.TOKENS.access.expirationSeconds;

      this.ACCESS_TOKEN_SECRET = parsed.ACCESS_TOKEN_SECRET
        || constants.TOKENS.access.secret;

      this.APP_ENV = parsed.APP_ENV
        || process.env.APP_ENV
        || constants.ENVS.development;

      this.DATABASE = {
        host: parsed.DATABASE_HOST || constants.DATABASE.host,
        name: parsed.DATABASE_NAME || constants.DATABASE.name,
        password: parsed.DATABASE_PASSWORD || '',
        port: parsed.DATABASE_PORT || '',
        prefix: parsed.DATABASE_PREFIX || constants.DATABASE.prefix,
        username: parsed.DATABASE_USERNAME || '',
      };

      this.PORT = Number(parsed.PORT) || constants.DEFAULT_PORT;

      this.REDIS = {
        flushOnStartup: parsed.REDIS_FLUSH_ON_STARTUP === 'true',
        host: parsed.REDIS_HOST || constants.REDIS.host,
        password: parsed.REDIS_PASSWORD || '',
        port: parsed.REDIS_PORT || constants.REDIS.port,
        username: parsed.REDIS_USERNAME || '',
      };

      this.REDIS_TEST = {
        host: parsed.REDIS_TEST_HOST || constants.REDIS.host,
        password: parsed.REDIS_TEST_PASSWORD || '',
        port: parsed.REDIS_TEST_PORT || constants.REDIS.port,
        username: parsed.REDIS_TEST_USERNAME || '',
      };

      this.REFRESH_TOKEN_EXPIRATION_SECONDS = Number(parsed.REFRESH_TOKEN_EXPIRATION_SECONDS)
        || constants.TOKENS.refresh.expirationSeconds;

      this.REFRESH_TOKEN_SECRET = parsed.REFRESH_TOKEN_SECRET
        || constants.TOKENS.refresh.secret;

      this.#initialized = true;
    }
  }
}

export default Configuration;
