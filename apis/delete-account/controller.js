import { ObjectId } from 'mongodb';
import { requestContext } from '@fastify/request-context';

import { CONTEXT_STORE_KEYS, ID_FIELD } from '../../constants/index.js';
import CustomError from '../../utilities/custom-error.js';
import database from '../../database/index.js';
import rc from '../../redis/index.js';
import response from '../../utilities/response.js';
import '../../types.js';

/**
 * Delete own account
 * @param {FastifyRequest} request
 * @param {FastifyReply} reply
 * @returns {Promise<void>}
 */
export default async function deleteAccountController(request, reply) {
  const userId = requestContext.get(CONTEXT_STORE_KEYS.userId);
  if (!userId) {
    throw new CustomError();
  }

  const session = database.client.startSession();
  const userObjectId = new ObjectId(userId);
  try {
    await session.withTransaction(
      async () => {
        await Promise.all([
          database
            .db
            .collection(database.collections.Password)
            .deleteOne({ userId: userObjectId }),
          database
            .db
            .collection(database.collections.RefreshToken)
            .deleteMany({ userId: userObjectId }),
          database
            .db
            .collection(database.collections.User)
            .deleteOne({ [ID_FIELD]: userObjectId }),
          database
            .db
            .collection(database.collections.UserSecret)
            .deleteOne({ userId: userObjectId }),
          rc.client.del(rc.keyFormatter(rc.prefixes.secret, userId)),
        ]);

        return response({ reply, request });
      },
      database.transactionOptions,
    );
  } finally {
    await session.endSession();
  }
}
