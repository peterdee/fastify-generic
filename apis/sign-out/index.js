import authorization from '../../middlewares/authorization.js';
import controller from './controller.js';
import schema from './schema.js';
import '../../types.js';

/**
 * Register APIs
 * @param {FastifyInstance} instance
 * @returns {Promise<void>}
 */
export default async function register(instance) {
  instance.post(
    '/api/sign-out',
    {
      preHandler: [authorization],
      schema: {
        body: schema,
      },
      validatorCompiler: ({ schema: joiSchema }) => (data) => joiSchema.validate(data),
    },
    controller,
  );
}
