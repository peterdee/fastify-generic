import { requestContext } from '@fastify/request-context';

import {
  CONTEXT_STORE_KEYS,
  RESPONSE_MESSAGES,
  STATUS_CODES,
} from '../constants/index.js';
import '../types.js';

/**
 * @typedef {Object} ResponsePayload
 * @property {*} [data=null]
 * @property {*} [errorDetails=null]
 * @property {string} [info=RESPONSE_MESSAGES.ok]
 * @property {FastifyReply} reply
 * @property {FastifyRequest} request
 * @property {number} [status=STATUS_CODES.ok]
 */

/**
 * Format paginated data for response
 * @param {Pagination} paginationQueryData
 * @param {number} count
 * @param {unknown[]} results
 */
export function formatPaginatedData(paginationQueryData, count, results) {
  return {
    pagination: {
      currentPage: paginationQueryData.page,
      limit: paginationQueryData.limit,
      totalCount: count,
      totalPages: Math.ceil(count / paginationQueryData.limit),
    },
    values: results,
  };
}

/**
 * Send response
 * @param {ResponsePayload}
 * @returns {FastifyReply}
 */
export default function response({
  data = null,
  errorDetails = null,
  info = RESPONSE_MESSAGES.ok,
  reply,
  request,
  status = STATUS_CODES.ok,
}) {
  const payload = {
    datetime: Date.now(),
    info,
    request: `${request.url} [${request.method}]`,
    status,
  };

  if (data) {
    payload.data = data;
  }

  if (errorDetails) {
    payload.errorDetails = errorDetails;
  }

  const incomingTimestamp = requestContext.get(CONTEXT_STORE_KEYS.incomingTimestamp);
  if (incomingTimestamp) {
    payload.processingTimeMS = Date.now() - incomingTimestamp;
  }

  return reply.status(status).send(payload);
}
