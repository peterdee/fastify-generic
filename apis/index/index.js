import controller from './controller.js';

/**
 * Register APIs
 * @param {import('fastify').FastifyInstance} instance
 * @returns {Promise<void>}
 */
export default async function register(instance) {
  instance.get('/', controller);
  instance.get('/api', controller);
}