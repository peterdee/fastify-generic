import controller from './controller.js';
import schema from './schema.js';
import '../../types.js';

/**
 * @api {POST} /api/refresh-tokens Refresh tokens
 * @apiGroup Refresh tokens
 * @apiName refresh-tokens
 * @apiSampleRequest http://localhost:9999/api/refresh-tokens
 *
 * @apiBody {String} refreshToken Refresh token that can be used to get a new token pair
 *
 * @apiSuccess (200) {Number} datetime Response timestamp
 * @apiSuccess (200) {String} info Response info text
 * @apiSuccess (200) {String} request Request path & method
 * @apiSuccess (200) {Number} status Response status
 * @apiSuccess (200) {Object} data Data object with new tokens
 * @apiSuccess (200) {Number} processingTimeMS How much time it took to process the request
 *
 * @apiSuccessExample {json} 200
 * {
 *   "datetime": 1703440648998,
 *   "info": "OK",
 *   "request": "/api/refresh-tokens [POST]",
 *   "status": 200,
 *   "data": {
 *     "tokens": {
 *       "accessToken": "string",
 *       "refreshToken": "string"
 *     }
 *   }
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
    '/api/refresh-tokens',
    {
      schema: {
        body: schema,
      },
      validatorCompiler: ({ schema: joiSchema }) => (data) => joiSchema.validate(data),
    },
    controller,
  );
}
