import bodyParser from '@fastify/formbody';
import cors from '@fastify/cors';
import fastify from 'fastify';
import { fastifyRequestContext } from '@fastify/request-context';
import helmet from '@fastify/helmet';
import { join } from 'node:path';
import serveStatic from '@fastify/static';
import { stat } from 'node:fs/promises';

import configuration from './configuration/index.js';
import database from './database/index.js';
import { CONTEXT_STORE_KEYS, ENVS } from './constants/index.js';
import globalErrorHandler from './utilities/global-error-handler.js';
import gracefulShutdown from './utilities/graceful-shutdown.js';
import incomingTimestamp from './hooks/incoming-timestamp.js';
import logger from './utilities/logger.js';
import notFoundHandler from './utilities/not-found-handler.js';
import rc from './redis/index.js';

import changePasswordAPI from './apis/change-password/index.js';
import deleteAccountAPI from './apis/delete-account/index.js';
import indexAPI from './apis/index/index.js';
import meAPI from './apis/me/index.js';
import refreshTokensAPI from './apis/refresh-tokens/index.js';
import signInAPI from './apis/sign-in/index.js';
import signOutAPI from './apis/sign-out/index.js';
import signOutFullAPI from './apis/sign-out-full/index.js';
import signUpAPI from './apis/sign-up/index.js';
import updateAccountAPI from './apis/update-account/index.js';
import userAPI from './apis/user/index.js';
import usersAPI from './apis/users/index.js';

export default async function createServer() {
  const server = fastify({
    logger: configuration.APP_ENV === ENVS.development,
  });

  await server.register(bodyParser);
  await server.register(cors);

  const helmetOptions = {};
  if (configuration.APP_ENV !== ENVS.production) {
    helmetOptions.contentSecurityPolicy = false;
  }
  await server.register(helmet, helmetOptions);

  await server.register(
    fastifyRequestContext,
    {
      defaultStoreValues: {
        [CONTEXT_STORE_KEYS.incomingTimestamp]: null,
        [CONTEXT_STORE_KEYS.paginationQueryData]: null,
        [CONTEXT_STORE_KEYS.searchQueryData]: null,
        [CONTEXT_STORE_KEYS.userId]: null,
      },
    },
  );

  if (configuration.APP_ENV !== ENVS.production) {
    const documentationPath = join(process.cwd(), 'documentation');
    try {
      await stat(documentationPath);
      await server.register(
        serveStatic,
        {
          cacheControl: false,
          prefix: '/docs/',
          prefixAvoidTrailingSlash: true,
          root: join(process.cwd(), 'documentation'),
        },
      );
      logger('Serving API documentation');
    } catch {
      logger('API documentation not served: no static files found');
    }
  }

  server.setErrorHandler(globalErrorHandler);
  server.setNotFoundHandler(notFoundHandler);

  server.addHook('onRequest', incomingTimestamp);

  await Promise.all([
    server.register(changePasswordAPI),
    server.register(deleteAccountAPI),
    server.register(indexAPI),
    server.register(meAPI),
    server.register(refreshTokensAPI),
    server.register(signInAPI),
    server.register(signOutAPI),
    server.register(signOutFullAPI),
    server.register(signUpAPI),
    server.register(updateAccountAPI),
    server.register(userAPI),
    server.register(usersAPI),
  ]);

  // TODO: close these connections when Fastify server shuts down
  await Promise.all([
    database.connect(
      configuration.DATABASE.connectionString,
      configuration.DATABASE.databaseName,
    ),
    rc.connect(configuration.REDIS_CONNECTION_STRING),
  ]);

  if (configuration.APP_ENV === ENVS.production) {
    process.on(
      'SIGINT',
      (signal) => gracefulShutdown(
        signal,
        server,
        database.client,
        rc.client,
      ),
    );
    process.on(
      'SIGTERM',
      (signal) => gracefulShutdown(
        signal,
        server,
        database.client,
        rc.client,
      ),
    );
  }

  return server;
}
