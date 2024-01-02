import configuration from './configuration/index.js';

(async () => {
  const { default: createServer } = await import('./server.js');
  const server = await createServer();

  try {
    await server.listen({ port: configuration.PORT });
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
})();
