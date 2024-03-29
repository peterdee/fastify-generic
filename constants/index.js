export const CONTEXT_STORE_KEYS = {
  incomingTimestamp: 'incomingTimestamp',
  paginationQueryData: 'paginationQueryData',
  searchQueryData: 'searchQueryData',
  userId: 'userId',
};

export const DEFAULT_LIMIT = 10;

export const DEFAULT_PAGE = 1;

export const DEFAULT_PORT = 9999;

export const DATABASE = {
  host: 'localhost',
  name: 'fastify-generic',
  prefix: 'mongodb://',
};

export const ENVS = {
  development: 'development',
  production: 'production',
  testing: 'testing',
};

export const ID_FIELD = '_id';

export const REDIS = {
  host: 'localhost',
  port: 6379,
};

export const RESPONSE_MESSAGES = {
  emailIsAlreadyInUse: 'EMAIL_IS_ALREADY_IN_USE',
  internalServerError: 'INTERNAL_SERVER_ERROR',
  invalidData: 'INVALID_DATA',
  notFound: 'NOT_FOUND',
  ok: 'OK',
  oldPasswordIsInvalid: 'OLD_PASSWORD_IS_INVALID',
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
