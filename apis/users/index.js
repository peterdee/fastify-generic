import authorization from '../../middlewares/authorization.js';
import controller from './controller.js';
import '../../types.js';

/**
 * Register APIs
 * @param {FastifyInstance} instance
 * @returns {Promise<void>}
 */
export default async function register(instance) {
  instance.get(
    '/api/users',
    {
      preHandler: [authorization],
    },
    controller,
  );
}
