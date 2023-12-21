import { requestContext } from '@fastify/request-context';

import { CONTEXT_STORE_KEYS } from '../../constants/index.js';
import database from '../../database/index.js';
import response, { formatPaginatedData } from '../../utilities/response.js';
import '../../types.js';

/**
 * Get users
 * @param {FastifyRequest} request
 * @param {FastifyReply} reply
 * @returns {Promise<FastifyReply>}
 */
export default async function getUsers(request, reply) {
  /** @type {Pagination} */
  const paginationQueryData = requestContext.get(CONTEXT_STORE_KEYS.paginationQueryData);

  const [users, count] = await Promise.all([
    database
      .db
      .collection(database.collections.User)
      .find()
      .skip(paginationQueryData.offset)
      .limit(paginationQueryData.limit)
      .toArray(),
    database
      .db
      .collection(database.collections.User)
      .estimatedDocumentCount(),
  ]);

  return response({
    data: formatPaginatedData(paginationQueryData, count, users),
    reply,
    request,
  });
}
