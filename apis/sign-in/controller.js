import { compareHashes } from '../../utilities/hashing.js';
import configuration from '../../configuration/index.js';
import createTimestamp from '../../utilities/create-timestamp.js';
import { createToken } from '../../utilities/jwt.js';
import CustomError from '../../utilities/custom-error.js';
import database from '../../database/index.js';
import response from '../../utilities/response.js';
import { RESPONSE_MESSAGES, STATUS_CODES } from '../../constants/index.js';
import '../../types.js';

const idField = '_id';

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

  /** @type {User} */
  const userRecord = await database.db.collection(database.collections.User).findOne({ email });
  if (!userRecord) {
    throw unauthorizedError;
  }

  /** @type {Password} */
  const passwordRecord = await database.db.collection(database.collections.Password).findOne({
    userId: userRecord[idField],
  });
  if (!passwordRecord) {
    throw unauthorizedError;
  }

  const passwordIsValid = await compareHashes(password, passwordRecord.passwordHash);
  if (!passwordIsValid) {
    throw unauthorizedError;
  }

  /** @type {UserSecret} */
  const userSecretRecord = await database.db.collection(database.collections.UserSecret).findOne({
    userId: userRecord[idField],
  });
  if (!userSecretRecord) {
    throw unauthorizedError;
  }

  const [accessToken, refreshToken] = await Promise.all([
    createToken(
      userRecord.userId,
      userSecretRecord.secretString,
      configuration.ACCESS_TOKEN_EXPIRATION_SECONDS,
    ),
    createToken(
      userRecord.userId,
      userSecretRecord.secretString,
      configuration.REFRESH_TOKEN_EXPIRATION_SECONDS,
    ),
  ]);

  await database.db.collection(database.collections.RefreshToken).insertOne({
    expiresAt: createTimestamp() + configuration.REFRESH_TOKEN_EXPIRATION_SECONDS,
    tokenString: refreshToken,
    userId: userRecord[idField],
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
}
