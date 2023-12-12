import * as constants from '../constants/index.js';

export default class Configuration {
  ACCESS_TOKEN_EXPIRATION_SECONDS = constants.TOKENS.access.expirationSeconds;

  ACCESS_TOKEN_SECRET = constants.TOKENS.access.secret;

  APP_ENV = constants.ENVS.development;

  DATABASE = {
    connectionString: constants.DATABASE.defaultConnectionString,
    databaseName: constants.DATABASE.defaultDatabaseName,
  };

  PORT = constants.DEFAULT_PORT;

  REFRESH_TOKEN_EXPIRATION_SECONDS = constants.TOKENS.refresh.expirationSeconds;

  REFRESH_TOKEN_SECRET = constants.TOKENS.refresh.secret;

  constructor(parsed = {}) {
    this.ACCESS_TOKEN_EXPIRATION_SECONDS ||= parsed.ACCESS_TOKEN_EXPIRATION_SECONDS;
    this.ACCESS_TOKEN_SECRET ||= parsed.ACCESS_TOKEN_SECRET;
    this.APP_ENV ||= parsed.APP_ENV;
    this.DATABASE = {
      connectionString: parsed.DATABASE_CONNECTION_STRING
        || constants.DATABASE.defaultConnectionString,
      databaseName: parsed.DATABASE_NAME
        || constants.DATABASE.defaultDatabaseName,
    };
    this.PORT ||= Number(parsed.PORT);
    this.REFRESH_TOKEN_EXPIRATION_SECONDS ||= parsed.REFRESH_TOKEN_EXPIRATION_SECONDS;
    this.REFRESH_TOKEN_SECRET ||= parsed.REFRESH_TOKEN_SECRET;
  }
}

export function createConfiguration(parsed) {
  new Configuration(parsed);
};

