import { ObjectId } from 'mongodb';
import { requestContext } from '@fastify/request-context';

import configuration from '../../configuration/index.js';
import { CONTEXT_STORE_KEYS } from '../../constants/index.js';
import { createHash } from '../../utilities/hashing.js';
import createTimestamp from '../../utilities/create-timestamp.js';
import CustomError from '../../utilities/custom-error.js';
import database from '../../database/index.js';
import rc from '../../redis/index.js';
import response from '../../utilities/response.js';
import '../../types.js';

/**
 * Full sign out
 * @param {FastifyRequest} request
 * @param {FastifyReply} reply
 * @returns {Promise<void>}
 */
export default async function signInController(request, reply) {
  const userId = requestContext.get(CONTEXT_STORE_KEYS.userId);
  if (!userId) {
    throw new CustomError();
  }

  const session = database.client.startSession();
  try {
    await session.withTransaction(
      async () => {
        const now = createTimestamp();
        const [newSecretString] = await Promise.all([
          createHash(`${userId}${now}`),
          database
            .db
            .collection(database.collections.RefreshToken)
            .deleteMany({ userId: new ObjectId(userId) }),
          rc.client.del(rc.keyFormatter(rc.prefixes.secret, userId)),
        ]);

        await Promise.all([
          database
            .db
            .collection(database.collections.UserSecret)
            .updateOne(
              {
                userId: new ObjectId(userId),
              },
              {
                $set: {
                  secretString: newSecretString,
                  updatedAt: now,
                },
              },
            ),
          rc.client.set(
            rc.keyFormatter(rc.prefixes.secret, userId),
            newSecretString,
            {
              EX: configuration.ACCESS_TOKEN_EXPIRATION_SECONDS,
            },
          ),
        ]);

        return response({ reply, request });
      },
      database.transactionOptions,
    );
  } finally {
    await session.endSession();
  }
}
