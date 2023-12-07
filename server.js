import Fastify from 'fastify';

import globalErrorHandler from './utilities/global-error-handler.js';
import { PORT } from './configuration/index.js';

// apis
import indexRouter from './apis/index/index.js';
import signInRouter from './apis/sign-in/index.js';

export default async function createServer() {
  const server = Fastify({
    // logger: true,
  });

  server.setErrorHandler(globalErrorHandler);

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
