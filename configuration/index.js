import * as constants from '../constants/index.js';

class Configuration {
  static ACCESS_TOKEN_EXPIRATION_SECONDS = constants.TOKENS.access.expirationSeconds;

  static ACCESS_TOKEN_SECRET = constants.TOKENS.access.secret;

  static APP_ENV = constants.ENVS.development;

  static DATABASE = {
    connectionString: constants.DATABASE.defaultConnectionString,
    databaseName: constants.DATABASE.defaultDatabaseName,
  };

  static PORT = constants.DEFAULT_PORT;

  static REDIS_CONNECTION_STRING = constants.DEFAULT_REDIS_CONNECTION_STRING;

  static REDIS_FLUSH_ON_STARTUP = false;

  static REDIS_TEST_CONNECTION_STRING = constants.DEFAULT_REDIS_CONNECTION_STRING;

  static REFRESH_TOKEN_EXPIRATION_SECONDS = constants.TOKENS.refresh.expirationSeconds;

  static REFRESH_TOKEN_SECRET = constants.TOKENS.refresh.secret;

  static #initialized = false;

  static init(parsed = {}) {
    if (!this.#initialized) {
      this.ACCESS_TOKEN_EXPIRATION_SECONDS ||= Number(parsed.ACCESS_TOKEN_EXPIRATION_SECONDS);
      this.ACCESS_TOKEN_SECRET ||= parsed.ACCESS_TOKEN_SECRET;
      this.APP_ENV = parsed.APP_ENV || process.env.APP_ENV;
      this.DATABASE = {
        connectionString: parsed.DATABASE_CONNECTION_STRING
          || constants.DATABASE.defaultConnectionString,
        databaseName: parsed.DATABASE_NAME
          || constants.DATABASE.defaultDatabaseName,
      };
      this.PORT ||= Number(parsed.PORT);
      this.REDIS_CONNECTION_STRING ||= parsed.REDIS_CONNECTION_STRING;
      this.REDIS_FLUSH_ON_STARTUP = parsed.REDIS_FLUSH_ON_STARTUP === 'true';
      this.REDIS_TEST_CONNECTION_STRING ||= parsed.REDIS_TEST_CONNECTION_STRING;
      this.REFRESH_TOKEN_EXPIRATION_SECONDS ||= Number(parsed.REFRESH_TOKEN_EXPIRATION_SECONDS);
      this.REFRESH_TOKEN_SECRET ||= parsed.REFRESH_TOKEN_SECRET;

      this.#initialized = true;
    }
  }
}

export default Configuration;
