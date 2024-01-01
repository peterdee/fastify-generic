import { ObjectId } from 'mongodb';
import { requestContext } from '@fastify/request-context';

import { compareHashes, createHash } from '../../utilities/hashing.js';
import {
  CONTEXT_STORE_KEYS,
  ID_FIELD,
  RESPONSE_MESSAGES,
  STATUS_CODES,
} from '../../constants/index.js';
import createTimestamp from '../../utilities/create-timestamp.js';
import CustomError from '../../utilities/custom-error.js';
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
        /** @type {Password} */
        const passwordRecord = await database
          .db
          .collection(database.collections.Password)
          .findOne({ userId: new ObjectId(userId) });
        if (!passwordRecord) {
          throw new CustomError({
            info: RESPONSE_MESSAGES.unauthorized,
            status: STATUS_CODES.unauthorized,
          });
        }

        const isValid = await compareHashes(body.oldPassword, passwordRecord.passwordHash);
        if (!isValid) {
          throw new CustomError({
            info: RESPONSE_MESSAGES.oldPasswordIsInvalid,
            status: STATUS_CODES.badRequest,
          });
        }

        const newPasswordHash = await createHash(body.newPassword);

        await database
          .db
          .collection(database.collections.User)
          .updateOne(
            { [ID_FIELD]: passwordRecord[ID_FIELD] },
            {
              $set: {
                passwordHash: newPasswordHash,
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
