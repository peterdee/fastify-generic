import assert from 'node:assert';
import { describe, it } from 'node:test';

import createServer from '../../server.js';
import { STATUS_CODES } from '../../constants/index.js';

const USER_EMAIL = 'test-email@test.com';
const USER_PASSWORD = 'test-password';

describe(
  'Test sign in controller',
  () => {
    it(
      'Should return 400 error if email is missing',
      async () => {
        const server = await createServer();
        const response = await server.inject({
          body: {
            password: USER_PASSWORD,
          },
          method: 'POST',
          path: '/api/sign-in',
        });
        await server.close();
        assert.ok(response.statusCode === STATUS_CODES.badRequest);
      },
    );

    it(
      'Should return 400 error if password is missing',
      async () => {
        const server = await createServer();
        const response = await server.inject({
          body: {
            email: USER_EMAIL,
          },
          method: 'POST',
          path: '/api/sign-in',
        });
        await server.close();
        assert.ok(response.statusCode === STATUS_CODES.badRequest);
      },
    );

    it(
      'Should return 400 error if email is invalid',
      async () => {
        const server = await createServer();
        const response = await server.inject({
          body: {
            email: 'email@invalid',
            password: USER_PASSWORD,
          },
          method: 'POST',
          path: '/api/sign-in',
        });
        await server.close();
        assert.ok(response.statusCode === STATUS_CODES.badRequest);
      },
    );
  },
);
