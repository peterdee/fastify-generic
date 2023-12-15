export const DEFAULT_PORT = 9999;

export const ENVS = {
  development: 'development',
  production: 'production',
  testing: 'testing',
};

export const DATABASE = {
  defaultConnectionString: 'mongodb://localhost:27017',
  defaultDatabaseName: 'fastify-generic',
};

export const DEFAULT_REDIS_CONNECTION_STRING = 'redis://localhost:6379';

export const RESPONSE_MESSAGES = {
  emailIsAlreadyInUse: 'EMAIL_IS_ALREADY_IN_USE',
  internalServerError: 'INTERNAL_SERVER_ERROR',
  notFound: 'NOT_FOUND',
  ok: 'OK',
  tokenIsExpired: 'TOKEN_IS_EXPIRED',
  tokenIsInvalid: 'TOKEN_IS_INVALID',
  tokenIsMissing: 'TOKEN_IS_MISSING',
  unauthorized: 'UNAUTHORIZED',
  validationError: 'VALIDATION_ERROR',
};

export const STATUS_CODES = {
  badRequest: 400,
  internalServerError: 500,
  notFound: 404,
  ok: 200,
  unauthorized: 401,
};

export const TOKENS = {
  access: {
    expirationSeconds: 86400,
    secret: 'default-access-secret',
  },
  refresh: {
    expirationSeconds: 1209600,
    secret: 'default-refresh-secret',
  },
};
