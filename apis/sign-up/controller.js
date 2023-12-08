import response from '../../utilities/response.js';

/** @typedef {import('fastify').FastifyReply} FastifyReply */

/**
 * Sign up controller
 * @param {import('fastify').FastifyRequest} request request object
 * @param {FastifyReply} reply reply object
 * @returns {Promise<FastifyReply>}
 */
export default async function signUpController(request, reply) {
  const { body } = request;

  return response({
    data: body,
    reply,
    request,
  });
}
