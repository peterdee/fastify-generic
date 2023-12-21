import { requestContext } from '@fastify/request-context';

import {
  CONTEXT_STORE_KEYS,
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
} from '../constants/index.js';
import '../types.js';

/**
 * Process pagination values
 * @param {FastifyRequest} request
 * @returns {Promise<void>}
 */
export default async function pagination(request) {
  let {
    query: {
      limit = '',
      page = '',
    } = {},
  } = request;

  limit = Number(limit);
  if (!limit || limit < 1) {
    limit = DEFAULT_LIMIT;
  }

  page = Number(page);
  if (!page || page < DEFAULT_PAGE) {
    page = DEFAULT_PAGE;
  }

  requestContext.set(
    CONTEXT_STORE_KEYS.paginationQueryData,
    {
      limit,
      offset: (page - 1) * limit,
      page,
    },
  );
}
