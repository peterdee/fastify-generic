import response from '../../utilities/response.js';
import '../../types.js';

/**
 * @api {get} /
 * @apiGroup Index
 */

/**
 * @api {get} /api
 * @apiGroup Index
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
