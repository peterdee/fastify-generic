import { createHash } from '../../utilities/hashing.js';
import configuration from '../../configuration/index.js';
import { createToken } from '../../utilities/jwt.js';
import CustomError from '../../utilities/custom-error.js';
import database from '../../database/index.js';
import response from '../../utilities/response.js';
import { RESPONSE_MESSAGES, STATUS_CODES } from '../../constants/index.js';
import createTimestamp from '../../utilities/create-timestamp.js';
import '../../types.js';

const idField = '_id';

/**
 * Sign up controller
 * @param {FastifyRequest} request
 * @param {FastifyReply} reply
 * @returns {Promise<FastifyReply>}
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

        /** @type {User} */
        const newUser = {
          email,
          firstName,
          lastName,
        };
        const { insertedId: userId } = await database
          .db
          .collection(database.collections.User)
          .insertOne(newUser);
        newUser[idField] = userId;

        const [passwordHash, secretString] = await Promise.all([
          createHash(password),
          createHash(`${userId}${createTimestamp()}`),
        ]);

        await Promise.all([
          database
            .db
            .collection(database.collections.Password)
            .insertOne({
              passwordHash,
              userId,
            }),
          database
            .db
            .collection(database.collections.UserSecret)
            .insertOne({
              secretString,
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
        ]);

        if (!(accessToken && refreshToken)) {
          throw new CustomError();
        }

        await database
          .db
          .collection(database.collections.RefreshToken)
          .insertOne({
            expiresAt: createTimestamp() + configuration.REFRESH_TOKEN_EXPIRATION_SECONDS,
            tokenString: refreshToken,
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
