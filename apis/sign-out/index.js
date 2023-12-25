import authorization from '../../middlewares/authorization.js';
import controller from './controller.js';
import schema from './schema.js';
import '../../types.js';

/**
 * @api {POST} /api/sign-out Sign out
 * @apiGroup Sign out
 * @apiHeader {String} Authorization API access token
 * @apiName sign-out
 * @apiSampleRequest http://localhost:9999/api/sign-out
 *
 * @apiBody {String} refreshToken Refresh token that should be invalidated
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
 *   "request": "/api/sign-out [POST]",
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
