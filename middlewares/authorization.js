import CustomError from '../utilities/custom-error.js';
import { RESPONSE_MESSAGES, STATUS_CODES } from '../constants/index.js';
import '../types.js';

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

  } catch (error) {
    
  }
}
