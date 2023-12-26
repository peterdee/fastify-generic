import authorization from '../../middlewares/authorization.js';
import controller from './controller.js';
import pagination from '../../middlewares/pagination.js';
import '../../types.js';

/**
 * @api {GET} /api/users Get users (paginated)
 * @apiGroup Users
 * @apiHeader {String} Authorization API access token
 * @apiName users
 * @apiSampleRequest http://localhost:9999/api/users
 *
 * @apiQuery {Number} [limit] Items per page
 * @apiQuery {Number} [page] Page number
 *
 * @apiSuccess (200) {Number} datetime Response timestamp
 * @apiSuccess (200) {String} info Response info text
 * @apiSuccess (200) {String} request Request path & method
 * @apiSuccess (200) {Number} status Response status
 * @apiSuccess (200) {Object} data Data object with pagination data & user accounts
 * @apiSuccess (200) {Number} processingTimeMS How much time it took to process the request
 *
 * @apiSuccessExample {json} 200
 * {
 *   "datetime": 1703440648998,
 *   "info": "OK",
 *   "request": "/api/users [GET]",
 *   "status": 200,
 *   "data": {
 *     "pagination": {
 *       "currentPage": "number",
 *       "limit": "number",
 *       "totalCount": "number",
 *       "totalPages": "number"
 *     },
 *     "values": [
 *       {
 *         "_id": "string",
 *         "email": "string",
 *         "firstName": "string",
 *         "lastName": "string"
 *       }
 *     ]
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
    '/api/users',
    {
      preHandler: [authorization, pagination],
    },
    controller,
  );
}
