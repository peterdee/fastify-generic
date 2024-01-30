import * as constants from '../constants/index.js';

class Configuration {
  static ACCESS_TOKEN_EXPIRATION_SECONDS;

  static ACCESS_TOKEN_SECRET;

  static APP_ENV;

  static DATABASE;

  static PORT;

  static REDIS_CONNECTION_STRING;

  static REDIS_FLUSH_ON_STARTUP;

  static REDIS_TEST_CONNECTION_STRING;

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
        connectionString: parsed.DATABASE_CONNECTION_STRING
          || constants.DATABASE.defaultConnectionString,
        databaseName: parsed.DATABASE_NAME
          || constants.DATABASE.defaultDatabaseName,
      };

      this.PORT = Number(parsed.PORT) || constants.DEFAULT_PORT;

      this.REDIS_CONNECTION_STRING = parsed.REDIS_CONNECTION_STRING
        || constants.DEFAULT_REDIS_CONNECTION_STRING;

      this.REDIS_FLUSH_ON_STARTUP = parsed.REDIS_FLUSH_ON_STARTUP === 'true';

      this.REDIS_TEST_CONNECTION_STRING = parsed.REDIS_TEST_CONNECTION_STRING
        || constants.DEFAULT_REDIS_CONNECTION_STRING;

      this.REFRESH_TOKEN_EXPIRATION_SECONDS = Number(parsed.REFRESH_TOKEN_EXPIRATION_SECONDS)
        || constants.TOKENS.refresh.expirationSeconds;

      this.REFRESH_TOKEN_SECRET = parsed.REFRESH_TOKEN_SECRET
        || constants.TOKENS.refresh.secret;

      this.#initialized = true;
    }
  }
}

export default Configuration;
