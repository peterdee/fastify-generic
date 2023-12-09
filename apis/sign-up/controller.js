import response from '../../utilities/response.js';
import '../../types.js';

/**
 * Sign up controller
 * @param {FastifyRequest} request
 * @param {FastifyReply} reply
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
