import CustomError from './custom-error.js';
import response from './response.js';
import { RESPONSE_MESSAGES, STATUS_CODES } from '../constants/index.js';

/** @typedef {import('fastify').FastifyReply} FastifyReply */

/**
 * Global error handler
 * @param {CustomError | Error} error
 * @param {import('fastify').FastifyRquest} request
 * @param {FastifyReply} reply
 * @returns {FastifyReply}
 */
export default async function globalErrorHandler(error, request, reply) {
  if (error instanceof CustomError) {
    return response({
      error,
      info: error.info,
      reply,
      request,
      status: error.status,
    });
  }
  return response({
    error,
    info: RESPONSE_MESSAGES.internalServerError,
    reply,
    request,
    status: STATUS_CODES.internalServerError,
  });
}
