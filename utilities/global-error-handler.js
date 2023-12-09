import joi from 'joi';

import CustomError from './custom-error.js';
import logger from './logger.js';
import response from './response.js';
import { RESPONSE_MESSAGES, STATUS_CODES } from '../constants/index.js';
import '../types.js';

/**
 * Global error handler
 * @param {CustomError | Error} error
 * @param {FastifyRquest} request
 * @param {FastifyReply} reply
 * @returns {FastifyReply}
 */
export default async function globalErrorHandler(error, request, reply) {
  if (error instanceof CustomError) {
    return response({
      info: error.info,
      reply,
      request,
      status: error.status,
    });
  }
  if (error instanceof joi.ValidationError) {
    return response({
      errorDetails: error.details,
      info: RESPONSE_MESSAGES.validationError,
      reply,
      request,
      status: STATUS_CODES.badRequest,
    });
  }
  logger('Internal server error:\n', error);
  return response({
    info: RESPONSE_MESSAGES.internalServerError,
    reply,
    request,
    status: STATUS_CODES.internalServerError,
  });
}
