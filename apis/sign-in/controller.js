import response from '../../utilities/response.js';

/** @typedef {import('fastify').FastifyReply} FastifyReply */

/**
 * Sign in controller
 * @param {import('fastify').FastifyRequest} request request object
 * @param {FastifyReply} reply reply object
 * @returns {Promise<FastifyReply>}
 */
export default async function signInController(request, reply) {
  const { body } = request;

  return response({
    data: body,
    reply,
    request,
  });
}
