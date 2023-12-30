import { ObjectId } from 'mongodb';
import { requestContext } from '@fastify/request-context';

import {
  CONTEXT_STORE_KEYS,
  ID_FIELD,
  RESPONSE_MESSAGES,
  STATUS_CODES,
} from '../../constants/index.js';
import CustomError from '../../utilities/custom-error.js';
import database from '../../database/index.js';
import response from '../../utilities/response.js';

/**
 * Get own account
 * @param {FastifyRequest} request
 * @param {FastifyReply} reply
 * @returns {Promise<FastifyReply>}
 */
export default async function me(request, reply) {
  const userId = requestContext.get(CONTEXT_STORE_KEYS.userId);

  const user = await database
    .db
    .collection(database.collections.User)
    .findOne({ [ID_FIELD]: new ObjectId(userId) });

  if (!user) {
    throw new CustomError({
      info: RESPONSE_MESSAGES.unauthorized,
      status: STATUS_CODES.unauthorized,
    });
  }

  return response({
    data: { user },
    reply,
    request,
  });
}
