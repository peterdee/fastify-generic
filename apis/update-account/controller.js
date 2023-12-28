import { ObjectId } from 'mongodb';
import { requestContext } from '@fastify/request-context';

import { CONTEXT_STORE_KEYS, ID_FIELD } from '../../constants/index.js';
import CustomError from '../../utilities/custom-error.js';
import database from '../../database/index.js';
import response from '../../utilities/response.js';
import '../../types.js';

/**
 * Update own account controller
 * @param {FastifyRequest} request
 * @param {FastifyReply} reply
 * @returns {Promise<FastifyReply>}
 */
export default async function updateAccountController(request, reply) {
  const { body = {} } = request;

  const userId = requestContext.get(CONTEXT_STORE_KEYS.userId);
  if (!userId) {
    throw new CustomError();
  }

  await database
    .db
    .collection(database.collections.User)
    .updateOne(
      { [ID_FIELD]: new ObjectId(userId) },
      { $set: { ...body } },
    );

  return response({ reply, request });
}
