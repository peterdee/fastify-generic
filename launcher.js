import configuration from './configuration/index.js';
import logger from './utilities/logger.js';

(async () => {
  const { default: createServer } = await import('./server.js');
  const server = await createServer();

  try {
    await server.listen({ port: configuration.PORT });
    logger(
      `Launched the server on port ${configuration.PORT} [APP_ENV: ${
        configuration.APP_ENV.toUpperCase()
      }]`,
    );
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
})();
