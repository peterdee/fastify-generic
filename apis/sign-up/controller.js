import configuration from '../../configuration/index.js';
import { createHash } from '../../utilities/hashing.js';
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

/**
 * Sign up
 * @param {FastifyRequest} request
 * @param {FastifyReply} reply
 * @returns {Promise<void>}
 */
export default async function signUpController(request, reply) {
  const {
    body: {
      email,
      firstName,
      lastName,
      password,
    } = {},
  } = request;

  const session = database.client.startSession();
  try {
    await session.withTransaction(
      async () => {
        const existingUserRecord = await database
          .db
          .collection(database.collections.User)
          .findOne({ email });
        if (existingUserRecord) {
          throw new CustomError({
            info: RESPONSE_MESSAGES.emailIsAlreadyInUse,
            status: STATUS_CODES.badRequest,
          });
        }

        const now = createTimestamp();

        /** @type {User} */
        const newUser = {
          createdAt: now,
          email,
          firstName,
          lastName,
          updatedAt: now,
        };
        const { insertedId: userId } = await database
          .db
          .collection(database.collections.User)
          .insertOne(newUser);
        newUser[ID_FIELD] = userId;

        const [passwordHash, secretString] = await Promise.all([
          createHash(password),
          createHash(`${userId}${now}`),
        ]);

        await Promise.all([
          database
            .db
            .collection(database.collections.Password)
            .insertOne({
              createdAt: now,
              passwordHash,
              updatedAt: now,
              userId,
            }),
          database
            .db
            .collection(database.collections.UserSecret)
            .insertOne({
              createdAt: now,
              secretString,
              updatedAt: now,
              userId,
            }),
        ]);

        const [accessToken, refreshToken] = await Promise.all([
          createToken(
            userId,
            secretString,
            configuration.ACCESS_TOKEN_EXPIRATION_SECONDS,
          ),
          createToken(
            userId,
            secretString,
            configuration.REFRESH_TOKEN_EXPIRATION_SECONDS,
          ),
          rc.client.set(
            rc.keyFormatter(rc.prefixes.secret, userId),
            secretString,
            {
              EX: configuration.ACCESS_TOKEN_EXPIRATION_SECONDS,
            },
          ),
        ]);

        if (!(accessToken && refreshToken)) {
          throw new CustomError();
        }

        await database
          .db
          .collection(database.collections.RefreshToken)
          .insertOne({
            createdAt: now,
            expiresAt: now + configuration.REFRESH_TOKEN_EXPIRATION_SECONDS,
            tokenString: refreshToken,
            updatedAt: now,
            userId,
          });

        return response({
          data: {
            tokens: {
              accessToken,
              refreshToken,
            },
            user: newUser,
          },
          reply,
          request,
        });
      },
      database.transactionOptions,
    );
  } finally {
    await session.endSession();
  }
}
