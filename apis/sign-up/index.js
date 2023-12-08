import controller from './controller.js';
import schema from './schema.js';

/**
 * Register APIs
 * @param {import('fastify').FastifyInstance} instance
 * @returns {Promise<void>}
 */
export default async function register(instance) {
  instance.post(
    '/api/sign-up',
    {
      schema: {
        body: schema,
      },
      validatorCompiler: ({ schema: joiSchema }) => (data) => joiSchema.validate(data),
    },
    controller,
  );
}
