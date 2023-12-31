import { ObjectId } from 'mongodb';

import CustomError from '../../utilities/custom-error.js';
import database from '../../database/index.js';
import {
  ID_FIELD,
  RESPONSE_MESSAGES,
  STATUS_CODES,
} from '../../constants/index.js';
import response from '../../utilities/response.js';

const invalidDataError = new CustomError({
  info: RESPONSE_MESSAGES.invalidData,
  status: STATUS_CODES.badRequest,
});

/**
 * Get a single user by User ID
 * @param {FastifyRequest} request
 * @param {FastifyReply} reply
 * @returns {Promise<FastifyReply>}
 */
export default async function getUser(request, reply) {
  const { params: { id: userId = '' } = {} } = request;

  if (!ObjectId.isValid(userId)) {
    throw invalidDataError;
  }

  const user = await database
    .db
    .collection(database.collections.User)
    .findOne({ [ID_FIELD]: new ObjectId(userId) });
  if (!user) {
    throw invalidDataError;
  }

  return response({
    data: { user },
    reply,
    request,
  });
}
