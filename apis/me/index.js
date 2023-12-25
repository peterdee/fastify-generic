import authorization from '../../middlewares/authorization.js';
import controller from './controller.js';
import '../../types.js';

/**
 * @api {get} /api/me Get own account
 * @apiGroup Me
 * @apiHeader {String} Authorization API access token
 * @apiName me
 * @apiSampleRequest http://localhost:9999/api/me
 *
 * @apiSuccess (200) {Number} datetime Response timestamp
 * @apiSuccess (200) {String} info Response info text
 * @apiSuccess (200) {String} request Request path & method
 * @apiSuccess (200) {Number} status Response status
 * @apiSuccess (200) {Object} data Data object with own account
 * @apiSuccess (200) {Number} processingTimeMS How much time it took to process the request
 *
 * @apiSuccessExample {json} 200
 * {
 *   "datetime": 1703440648998,
 *   "info": "OK",
 *   "request": "/api/me [GET]",
 *   "status": 200,
 *   "data": {
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
  instance.get(
    '/api/me',
    {
      preHandler: [authorization],
    },
    controller,
  );
}
