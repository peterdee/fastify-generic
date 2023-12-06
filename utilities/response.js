import { RESPONSE_MESSAGES, STATUS_CODES } from '../constants/index.js';
import logger from './logger.js';

/** @typedef {import('fastify').FastifyReply} FastifyReply */
/**
 * @typedef {Object} ResponsePayload
 * @property {*} [data=null]
 * @property {Error} [error=null]
 * @property {string} [info=RESPONSE_MESSAGES.ok]
 * @property {FastifyReply} reply
 * @property {import('fastify').FastifyRequest} request
 * @property {number} [status=STATUS_CODES.ok]
 */

/**
 * Send response
 * @param {ResponsePayload}
 * @returns {FastifyReply}
 */
export default function response({
  data = null,
  error = null,
  info = RESPONSE_MESSAGES.ok,
  reply,
  request,
  status = STATUS_CODES.ok,
}) {
  if (error && status === STATUS_CODES.internalServerError) {
    logger('Internal server error:\n', error);
  }

  const payload = {
    datetime: Date.now(),
    info,
    request: `${request.url} [${request.method}]`,
    status,
  };

  if (data) {
    payload.data = data;
  }

  return reply.status(status).send(payload);
}
