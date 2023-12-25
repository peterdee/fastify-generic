import controller from './controller.js';
import schema from './schema.js';
import '../../types.js';

/**
 * @api {POST} /api/sign-up Sign up
 * @apiGroup Sign up
 * @apiName sign-up
 * @apiSampleRequest http://localhost:9999/api/sign-up
 *
 * @apiBody {String} email User email address
 * @apiBody {String} firstName User first name
 * @apiBody {String} lastName User last name
 * @apiBody {String} password User password
 *
 * @apiSuccess (200) {Number} datetime Response timestamp
 * @apiSuccess (200) {String} info Response info text
 * @apiSuccess (200) {String} request Request path & method
 * @apiSuccess (200) {Number} status Response status
 * @apiSuccess (200) {Object} data Data object with tokens and user account
 * @apiSuccess (200) {Number} processingTimeMS How much time it took to process the request
 *
 * @apiSuccessExample {json} 200
 * {
 *   "datetime": 1703440648998,
 *   "info": "OK",
 *   "request": "/api/sign-up [POST]",
 *   "status": 200,
 *   "data": {
 *     "tokens": {
 *       "accessToken": "string",
 *       "refreshToken": "string"
 *     },
 *     "user": {
 *       "_id": "string",
 *       "email": "string",
 *       "firstName": "string",
 *       "lastName": "string"
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
