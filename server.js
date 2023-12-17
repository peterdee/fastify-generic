import bodyParser from '@fastify/formbody';
import cors from '@fastify/cors';
import fastify from 'fastify';
import { fastifyRequestContext } from '@fastify/request-context';
import helmet from '@fastify/helmet';

import configuration from './configuration/index.js';
import { CONTEXT_STORE_KEYS, ENVS } from './constants/index.js';
import globalErrorHandler from './utilities/global-error-handler.js';
import notFoundHandler from './utilities/not-found-handler.js';

import indexAPI from './apis/index/index.js';
import signInAPI from './apis/sign-in/index.js';
import signUpAPI from './apis/sign-up/index.js';

export default async function createServer() {
  const server = fastify({
    logger: configuration.APP_ENV === ENVS.development,
  });

  server.register(bodyParser);
  server.register(cors);
  server.register(helmet);
  server.setErrorHandler(globalErrorHandler);
  server.setNotFoundHandler(notFoundHandler);

  server.register(fastifyRequestContext, {
    defaultStoreValues: {
      [CONTEXT_STORE_KEYS.incomingTimestamp]: Date.now(),
      [CONTEXT_STORE_KEYS.userId]: null,
    },
    hook: 'onRequest',
  });

  await server.register(indexAPI);
  await server.register(signInAPI);
  await server.register(signUpAPI);

  return server;
}
