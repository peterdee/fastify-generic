import { requestContext } from '@fastify/request-context';

import { CONTEXT_STORE_KEYS } from '../constants/index.js';

export default async function incomingTimestamp() {
  requestContext.set(CONTEXT_STORE_KEYS.incomingTimestamp, Date.now());
}
