import bodyParser from '@fastify/formbody';
import cors from '@fastify/cors';
import fastify from 'fastify';
import { fastifyRequestContext } from '@fastify/request-context';
import helmet from '@fastify/helmet';

import configuration from './configuration/index.js';
import { CONTEXT_STORE_KEYS, ENVS } from './constants/index.js';
import globalErrorHandler from './utilities/global-error-handler.js';
import incomingTimestamp from './hooks/incoming-timestamp.js';
import notFoundHandler from './utilities/not-found-handler.js';

import indexAPI from './apis/index/index.js';
import meAPI from './apis/me/index.js';
import signInAPI from './apis/sign-in/index.js';
import signUpAPI from './apis/sign-up/index.js';

export default async function createServer() {
  const server = fastify({
    logger: configuration.APP_ENV === ENVS.development,
  });

  await server.register(bodyParser);
  await server.register(cors);
  await server.register(helmet);
  await server.register(fastifyRequestContext, {
    defaultStoreValues: {
      [CONTEXT_STORE_KEYS.incomingTimestamp]: null,
      [CONTEXT_STORE_KEYS.userId]: null,
    },
  });

  server.setErrorHandler(globalErrorHandler);
  server.setNotFoundHandler(notFoundHandler);

  server.addHook('onRequest', incomingTimestamp);

  await server.register(indexAPI);
  await server.register(meAPI);
  await server.register(signInAPI);
  await server.register(signUpAPI);

  return server;
}
