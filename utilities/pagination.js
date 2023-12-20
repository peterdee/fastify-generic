import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../constants/index.js';
import '../types.js';

/**
 * Get pagination values
 * @param {FastifyRequest} requestQuery
 * @returns {Pagination}
 */
export default function pagination(request) {
  let {
    query: {
      limit = '',
      page = '',
    } = {},
  } = request;

  limit = Number(limit);
  if (!limit) {
    limit = DEFAULT_PORT;
  }
}
