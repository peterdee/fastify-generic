export const DEFAULT_PORT = 9999;

export const ENVS = {
  development: 'development',
  production: 'production',
};

export const RESPONSE_MESSAGES = {
  ok: 'OK',
};

export const STATUS_CODES = {
  badRequest: 400,
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
