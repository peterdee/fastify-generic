import { ObjectId } from 'mongodb';
import { requestContext } from '@fastify/request-context';

import { CONTEXT_STORE_KEYS } from '../../constants/index.js';
import database from '../../database/index.js';
import response from '../../utilities/response.js';
import '../../types.js';

/**
 * Sign out
 * @param {FastifyRequest} request
 * @param {FastifyReply} reply
 * @returns {Promise<FastifyReply>}
 */
export default async function signInController(request, reply) {
  const { body: { refreshToken } = {} } = request;

  const userId = requestContext.get(CONTEXT_STORE_KEYS.userId);

  await database
    .db
    .collection(database.collections.RefreshToken)
    .deleteOne({
      tokenString: refreshToken,
      userId: new ObjectId(userId),
    });

  return response({ reply, request });
}
