import { ObjectId } from 'mongodb';
import { requestContext } from '@fastify/request-context';

import { CONTEXT_STORE_KEYS, ID_FIELD } from '../../constants/index.js';
import createTimestamp from '../../utilities/create-timestamp.js';
import database from '../../database/index.js';
import response from '../../utilities/response.js';
import '../../types.js';

/**
 * Change own password
 * @param {FastifyRequest} request
 * @param {FastifyReply} reply
 * @returns {Promise<FastifyReply>}
 */
export default async function changePasswordController(request, reply) {
  const { body = {} } = request;

  const userId = requestContext.get(CONTEXT_STORE_KEYS.userId);
  const session = database.client.startSession();
  try {
    await session.withTransaction(
      async () => {
        await database
          .db
          .collection(database.collections.User)
          .updateOne(
            { [ID_FIELD]: new ObjectId(userId) },
            {
              $set: {
                ...body,
                updatedAt: createTimestamp(),
              },
            },
          );

        return response({ reply, request });
      },
      database.transactionOptions,
    );
  } finally {
    await session.endSession();
  }
}
