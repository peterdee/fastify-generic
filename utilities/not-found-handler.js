import response from './response.js';
import { RESPONSE_MESSAGES, STATUS_CODES } from '../constants/index.js';

export default function notFoundHandler(request, reply) {
  return response({
    info: RESPONSE_MESSAGES.notFound,
    reply,
    request,
    status: STATUS_CODES.notFound,
  });
}
