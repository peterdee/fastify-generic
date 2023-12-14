import configuration from '../../configuration/index.js';
import createTimestamp from '../../utilities/create-timestamp.js';
import { createToken, decodeToken, verifyToken } from '../../utilities/jwt.js';
import CustomError from '../../utilities/custom-error.js';
import database from '../../database/index.js';
import response from '../../utilities/response.js';
import { RESPONSE_MESSAGES, STATUS_CODES } from '../../constants/index.js';
import '../../types.js';

const unauthorizedError = new CustomError({
  info: RESPONSE_MESSAGES.unauthorized,
  status: STATUS_CODES.unauthorized,
});

/**
 * Refresh tokens controller
 * @param {FastifyRequest} request
 * @param {FastifyReply} reply
 * @returns {Promise<FastifyReply>}
 */
export default async function refreshTokensController(request, reply) {
  const { body: { refreshToken } } = request;

  /** @type {RefreshToken} */
  const refreshTokenRecord = await database
    .db
    .collection(database.collections.RefreshToken)
    .findOne({ tokenString: refreshToken });
  if (!refreshTokenRecord) {
    throw unauthorizedError;
  }

  let userId;
  try {
    const decoded = decodeToken(refreshToken);
    userId = decoded.id;
  } catch {
    throw unauthorizedError;
  }
  if (!userId) {
    throw unauthorizedError;
  }

  /** @type {UserSecret} */
  const userSecretRecord = await database
    .db
    .collection(database.collections.UserSecret)
    .findOne({ userId });
  if (!userSecretRecord) {
    throw unauthorizedError;
  }

  try {
    await verifyToken(refreshToken, userSecretRecord.secretString);
  } catch {
    throw unauthorizedError;
  }

  const [newAccessToken, newRefreshToken] = await Promise.all([
    createToken(
      userId,
      userSecretRecord.secretString,
      configuration.ACCESS_TOKEN_EXPIRATION_SECONDS,
    ),
    createToken(
      userId,
      userSecretRecord.secretString,
      configuration.REFRESH_TOKEN_EXPIRATION_SECONDS,
    ),
  ]);

  await Promise.all([
    database.db.collection(database.collections.RefreshToken).insertOne({
      expiresAt: createTimestamp() + configuration.REFRESH_TOKEN_EXPIRATION_SECONDS,
      tokenString: newRefreshToken,
      userId,
    }),
    database.db.collection(database.collections.RefreshToken).deleteOne({
      tokenString: refreshToken,
      userId,
    }),
  ]);

  return response({
    data: {
      tokens: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    },
    reply,
    request,
  });
}
