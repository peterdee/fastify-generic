import authorization from '../../middlewares/authorization.js';
import controller from './controller.js';
import schema from './schema.js';
import '../../types.js';

/**
 * @api {PATCH} /api/update-account Update own account
 * @apiGroup Update account
 * @apiHeader {String} Authorization API access token
 * @apiName update-account
 * @apiSampleRequest http://localhost:9999/api/update-account
 *
 * @apiSuccess (200) {Number} datetime Response timestamp
 * @apiSuccess (200) {String} info Response info text
 * @apiSuccess (200) {String} request Request path & method
 * @apiSuccess (200) {Number} status Response status
 * @apiSuccess (200) {Number} processingTimeMS How much time it took to process the request
 *
 * @apiSuccessExample {json} 200
 * {
 *   "datetime": 1703440648998,
 *   "info": "OK",
 *   "request": "/api/update-account [PATCH]",
 *   "status": 200,
 *   "processingTimeMS": 0
 * }
 */

/**
 * Register APIs
 * @param {FastifyInstance} instance
 * @returns {Promise<void>}
 */
export default async function register(instance) {
  instance.patch(
    '/api/update-account',
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
