import { requestContext } from '@fastify/request-context';
import { ObjectId } from 'mongodb';

import { CONTEXT_STORE_KEYS, ID_FIELD } from '../../constants/index.js';
import database from '../../database/index.js';
import response from '../../utilities/response.js';

/**
 * Get own account controller
 * @param {FastifyRequest} request
 * @param {FastifyReply} reply
 * @returns {Promise<FastifyReply>}
 */
export default async function me(request, reply) {
  const userId = requestContext.get(CONTEXT_STORE_KEYS.userId);

  const user = database
    .db
    .collection(database.collections.User)
    .findOne({ [ID_FIELD]: new ObjectId(userId) });

  return response({
    data: { user },
    reply,
    request,
  });
}
