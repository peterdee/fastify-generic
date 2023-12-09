import assert from 'node:assert';
import { describe, it } from 'node:test';

import createServer from '../../server.js';
import { STATUS_CODES } from '../../constants/index.js';

describe(
  'Test index controller',
  () => {
    it(
      'Should return 200 on index routes',
      async () => {
        const server = await createServer();
        const response1 = await server.inject({
          method: 'GET',
          path: '/',
        });
        const response2 = await server.inject({
          method: 'GET',
          path: '/api',
        });
        await server.close();
        assert.ok(response1.statusCode === STATUS_CODES.ok);
        assert.ok(response2.statusCode === STATUS_CODES.ok);
      },
    );
  },
);
