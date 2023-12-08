import assert from 'node:assert';
import { describe, it } from 'node:test';

import createServer from './server.js';
import { STATUS_CODES } from './constants/index.js';

describe(
  'Test server launching',
  () => {
    it(
      'Should launch the server',
      async () => {
        const server = await createServer();
        const response = await server.inject({
          method: 'GET',
          path: '/',
        });
        await server.close();
        assert.ok(response.statusCode === STATUS_CODES.ok);
      },
    );
  },
);
