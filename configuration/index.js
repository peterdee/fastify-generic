import * as constants from '../constants/index.js';

const { env: ev } = process;

export const ACCESS_TOKEN_EXPIRATION_SECONDS = Number(ev.ACCESS_TOKEN_EXPIRATION_SECONDS)
  || constants.TOKENS.access.expirationSeconds;

export const {
  ACCESS_TOKEN_SECRET = constants.TOKENS.access.secret,
  APP_ENV = constants.ENVS.development,
  REFRESH_TOKEN_SECRET = constants.TOKENS.refresh.secret,
} = ev;

export const DATABASE = {
  connectionString: ev.DATABASE_CONNECTION_STRING,
  databaseName: ev.DATABASE_NAME,
};

export const PORT = Number(ev.PORT) || constants.DEFAULT_PORT;

export const REFRESH_TOKEN_EXPIRATION_SECONDS = Number(ev.REFRESH_TOKEN_EXPIRATION_SECONDS)
  || constants.TOKENS.refresh.expirationSeconds;
