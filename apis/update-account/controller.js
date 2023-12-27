// import { ObjectId } from 'mongodb';
import { requestContext } from '@fastify/request-context';

// import configuration from '../../configuration/index.js';
import { CONTEXT_STORE_KEYS } from '../../constants/index.js';
// import { createHash } from '../../utilities/hashing.js';
// import createTimestamp from '../../utilities/create-timestamp.js';
import CustomError from '../../utilities/custom-error.js';
// import database from '../../database/index.js';
// import rc from '../../redis/index.js';
import response from '../../utilities/response.js';
import '../../types.js';

/**
 * Update own account controller
 * @param {FastifyRequest} request
 * @param {FastifyReply} reply
 * @returns {Promise<FastifyReply>}
 */
export default async function updateAccountController(request, reply) {
  const userId = requestContext.get(CONTEXT_STORE_KEYS.userId);
  if (!userId) {
    throw new CustomError();
  }

  return response({ reply, request });
}
