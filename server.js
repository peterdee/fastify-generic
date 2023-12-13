import bodyParser from '@fastify/formbody';
import fastify from 'fastify';

import configuration from './configuration/index.js';
import { ENVS } from './constants/index.js';
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
  server.setErrorHandler(globalErrorHandler);
  server.setNotFoundHandler(notFoundHandler);

  await server.register(indexAPI);
  await server.register(signInAPI);
  await server.register(signUpAPI);

  return server;
}
