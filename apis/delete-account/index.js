import authorization from '../../middlewares/authorization.js';
import controller from './controller.js';
import '../../types.js';

/**
 * @api {DELETE} /api/delete-account Delete own account
 * @apiGroup Delete account
 * @apiHeader {String} Authorization API access token
 * @apiName delete-account
 * @apiSampleRequest http://localhost:9999/api/delete-account
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
 *   "request": "/api/delete-account [DELETE]",
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
  instance.delete(
    '/api/delete-account',
    { preHandler: [authorization] },
    controller,
  );
}
