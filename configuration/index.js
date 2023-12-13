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

  static REFRESH_TOKEN_EXPIRATION_SECONDS = constants.TOKENS.refresh.expirationSeconds;

  static REFRESH_TOKEN_SECRET = constants.TOKENS.refresh.secret;

  static init(parsed = {}) {
    this.ACCESS_TOKEN_EXPIRATION_SECONDS &&= parsed.ACCESS_TOKEN_EXPIRATION_SECONDS;
    this.ACCESS_TOKEN_SECRET &&= parsed.ACCESS_TOKEN_SECRET;
    this.APP_ENV &&= parsed.APP_ENV;
    this.DATABASE = {
      connectionString: parsed.DATABASE_CONNECTION_STRING
        || constants.DATABASE.defaultConnectionString,
      databaseName: parsed.DATABASE_NAME
        || constants.DATABASE.defaultDatabaseName,
    };
    this.PORT &&= Number(parsed.PORT);
    this.REFRESH_TOKEN_EXPIRATION_SECONDS &&= parsed.REFRESH_TOKEN_EXPIRATION_SECONDS;
    this.REFRESH_TOKEN_SECRET &&= parsed.REFRESH_TOKEN_SECRET;
  }
}

export default Configuration;
