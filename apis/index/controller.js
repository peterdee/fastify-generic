import response from '../../utilities/response.js';
import '../../types.js';

/**
 * @api {get} / Index route
 * @apiGroup Index
 * @apiName index
 * @apiSampleRequest /
 */

/**
 * @api {get} /api API index route
 * @apiGroup Index
 * @apiName APIindex
 */

/**
 * Index controller
 * @param {FastifyRequest} request
 * @param {FastifyReply} reply
 * @returns {FastifyReply}
 */
export default function indexController(request, reply) {
  return response({ request, reply });
}
