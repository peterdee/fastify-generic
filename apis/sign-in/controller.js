import { compareHashes } from '../../utilities/hashing.js';
import configuration from '../../configuration/index.js';
import createTimestamp from '../../utilities/create-timestamp.js';
import { createToken } from '../../utilities/jwt.js';
import CustomError from '../../utilities/custom-error.js';
import database from '../../database/index.js';
import {
  ID_FIELD,
  RESPONSE_MESSAGES,
  STATUS_CODES,
} from '../../constants/index.js';
import rc from '../../redis/index.js';
import response from '../../utilities/response.js';
import '../../types.js';

const unauthorizedError = new CustomError({
  info: RESPONSE_MESSAGES.unauthorized,
  status: STATUS_CODES.unauthorized,
});

/**
 * Sign in controller
 * @param {FastifyRequest} request
 * @param {FastifyReply} reply
 * @returns {Promise<FastifyReply>}
 */
export default async function signInController(request, reply) {
  const { body: { email, password } } = request;

  const session = database.client.startSession();
  try {
    await session.withTransaction(
      async () => {
        /** @type {User} */
        const userRecord = await database
          .db
          .collection(database.collections.User)
          .findOne({ email });
        if (!userRecord) {
          throw unauthorizedError;
        }

        /** @type {Password} */
        const passwordRecord = await database.db.collection(database.collections.Password).findOne({
          userId: userRecord[ID_FIELD],
        });
        if (!passwordRecord) {
          throw unauthorizedError;
        }

        const passwordIsValid = await compareHashes(password, passwordRecord.passwordHash);
        if (!passwordIsValid) {
          throw unauthorizedError;
        }

        /** @type {UserSecret} */
        const userSecretRecord = await database
          .db
          .collection(database.collections.UserSecret)
          .findOne({ userId: userRecord[ID_FIELD] });
        if (!userSecretRecord) {
          throw unauthorizedError;
        }

        const [accessToken, refreshToken] = await Promise.all([
          createToken(
            userRecord[ID_FIELD],
            userSecretRecord.secretString,
            configuration.ACCESS_TOKEN_EXPIRATION_SECONDS,
          ),
          createToken(
            userRecord[ID_FIELD],
            userSecretRecord.secretString,
            configuration.REFRESH_TOKEN_EXPIRATION_SECONDS,
          ),
          rc.client.set(
            rc.keyFormatter(rc.prefixes.secret, userRecord[ID_FIELD]),
            userSecretRecord.secretString,
            {
              EX: configuration.ACCESS_TOKEN_EXPIRATION_SECONDS,
            },
          ),
        ]);

        if (!(accessToken && refreshToken)) {
          throw new CustomError();
        }

        await database.db.collection(database.collections.RefreshToken).insertOne({
          expiresAt: createTimestamp() + configuration.REFRESH_TOKEN_EXPIRATION_SECONDS,
          tokenString: refreshToken,
          userId: userRecord[ID_FIELD],
        });

        return response({
          data: {
            tokens: {
              accessToken,
              refreshToken,
            },
            user: userRecord,
          },
          reply,
          request,
        });
      },
      {
        readConcern: { level: 'snapshot' },
        readPreference: 'primary',
        writeConcern: { w: 'majority' },
      },
    );
  } finally {
    await session.endSession();
  }
}
