import Fastify from 'fastify';

import { PORT } from './configuration/index.js';

export async function createServer() {
  const server = Fastify({
    logger: true,
  });
  
  try {
    await server.listen({ port: PORT });
    return server;
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
}
