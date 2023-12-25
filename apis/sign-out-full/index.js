import authorization from '../../middlewares/authorization.js';
import controller from './controller.js';
import '../../types.js';

/**
 * @api {get} /api/sign-out/full Sign out on all devices
 * @apiGroup Complete sign out
 * @apiHeader {String} Authorization API access token
 * @apiName sign-out-full
 * @apiSampleRequest http://localhost:9999/api/sign-out/full
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
 *   "request": "/api/sign-out/full [GET]",
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
  instance.get(
    '/api/sign-out/full',
    {
      preHandler: [authorization],
    },
    controller,
  );
}
