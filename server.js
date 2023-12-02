import Fastify from 'fastify';

import { PORT } from './configuration/index.js';

export default async function createServer() {
  const server = Fastify({
    logger: true,
  });

  try {
    await server.listen({ port: PORT });
    return server;
  } catch (error) {
    server.log.error(error);
    return process.exit(1);
  }
}
