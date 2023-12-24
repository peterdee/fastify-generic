import controller from './controller.js';
import '../../types.js';

/**
 * @api {get} / Index route
 * @apiGroup Index
 * @apiName index
 * @apiSampleRequest http://localhost:9999
 *
 * @apiSuccess (200) {Number} datetime Response timestamp
 * @apiSuccess (200) {String} info Response info text
 * @apiSuccess (200) {String} request Request path & method
 * @apiSuccess (200) {Number} status Response status
 * @apiSuccess (200) {Number} processingTimeMS How much time it took to process the request
 *
 * @apiSuccessExample {json}
 * {
 *   "datetime": 1703440648998,
 *   "info": "OK",
 *   "request": "/ [GET]",
 *   "status": 200,
 *   "processingTimeMS": 0
 * }
 */

/**
 * @api {get} /api API index route
 * @apiGroup Index
 * @apiName APIindex
 * @apiSampleRequest http://localhost:9999/api
 *
 * @apiSuccess (200) {Number} datetime Response timestamp
 * @apiSuccess (200) {String} info Response info text
 * @apiSuccess (200) {String} request Request path & method
 * @apiSuccess (200) {Number} status Response status
 * @apiSuccess (200) {Number} processingTimeMS How much time it took to process the request
 *
 * @apiSuccessExample {json}
 * {
 *   "datetime": 1703440648998,
 *   "info": "OK",
 *   "request": "/api [GET]",
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
  instance.get('/', controller);
  instance.get('/api', controller);
}
