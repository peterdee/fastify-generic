import response from '../../utilities/response.js';

/** @typedef {import('fastify').FastifyReply} FastifyReply */

/**
 * Index controller
 * @param {import('fastify').FastifyRequest} request
 * @param {FastifyReply} reply
 * @returns {FastifyReply}
 */
export default function indexController(request, reply) {
  return response({ request, reply });
}
