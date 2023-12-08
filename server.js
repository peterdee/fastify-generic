import bodyParser from '@fastify/formbody';
import fastify from 'fastify';

import globalErrorHandler from './utilities/global-error-handler.js';
import notFoundHandler from './utilities/not-found-handler.js';
import { PORT } from './configuration/index.js';

import indexRouter from './apis/index/index.js';
import signInRouter from './apis/sign-in/index.js';

export default async function createServer() {
  const server = fastify({
    logger: true,
  });

  server.register(bodyParser);
  server.setErrorHandler(globalErrorHandler);
  server.setNotFoundHandler(notFoundHandler);

  try {
    await server.register(indexRouter);
    await server.register(signInRouter);

    await server.listen({ port: PORT });
    return server;
  } catch (error) {
    server.log.error(error);
    return process.exit(1);
  }
}
