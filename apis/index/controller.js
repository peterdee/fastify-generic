import response from '../../utilities/response.js';
import '../../types.js';

/**
 * Index
 * @param {FastifyRequest} request
 * @param {FastifyReply} reply
 * @returns {FastifyReply}
 */
export default function indexController(request, reply) {
  return response({ request, reply });
}
