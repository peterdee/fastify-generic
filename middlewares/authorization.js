import jwt from 'jsonwebtoken';

import CustomError from '../utilities/custom-error.js';
import database from '../database/index.js';
import { decodeToken, verifyToken } from '../utilities/jwt.js';
import rc from '../redis/index.js';
import { RESPONSE_MESSAGES, STATUS_CODES } from '../constants/index.js';
import '../types.js';

const unauthorizedError = new CustomError({
  info: RESPONSE_MESSAGES.unauthorized,
  status: STATUS_CODES.unauthorized,
});

/**
 * Authorize request
 * @param {FastifyRequest} request
 * @returns {FastifyReply}
 */
export default async function authorization(request) {
  const { headers: { authorization: token = '' } = {} } = request;
  if (!token) {
    throw new CustomError({
      info: RESPONSE_MESSAGES.tokenIsMissing,
      status: STATUS_CODES.unauthorized,
    });
  }

  try {
    const decoded = decodeToken(token);
    if (!(decoded && decoded.id)) {
      throw new CustomError({
        info: RESPONSE_MESSAGES.tokenIsInvalid,
        status: STATUS_CODES.unauthorized,
      });
    }

    const userId = decoded.id;

    let tokenSecret = await rc.client.get(rc.keyFormatter(rc.prefixes.secret, userId));
    if (!tokenSecret) {
      /** @type {UserSecret} */
      const userSecretRecord = await database
        .db
        .collection(database.collections.UserSecret)
        .findOne({ userId });
      if (!userSecretRecord) {
        throw unauthorizedError;
      }
      tokenSecret = userSecretRecord.secretString;
      await rc.client.set(
        rc.keyFormatter(rc.prefixes.secret),
        tokenSecret,
        {
          EX: 1,
        },
      );
    }

    await verifyToken(token, tokenSecret);

    // TODO: use ALS to pass data to controller

    return null;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new CustomError({
        info: RESPONSE_MESSAGES.tokenIsExpired,
        status: STATUS_CODES.unauthorized,
      });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new CustomError({
        info: RESPONSE_MESSAGES.tokenIsInvalid,
        status: STATUS_CODES.unauthorized,
      });
    }
    throw error;
  }
}