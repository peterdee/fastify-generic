import response from '../../utilities/response.js';

/**
 * Index controller
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 * @returns {import('fastify').FastifyReply}
 */
export default function indexController(request, reply) {
  return response({ request, reply });
}
