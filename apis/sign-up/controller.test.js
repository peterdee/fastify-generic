import assert from 'node:assert';
import { describe, it } from 'node:test';

import createServer from '../../server.js';
import { STATUS_CODES } from '../../constants/index.js';

const USER_EMAIL = 'test-email@test.com';
const USER_FIRSTNAME = 'John';
const USER_LASTNAME = 'Smith';
const USER_PASSWORD = 'test-password';

describe(
  'Test sign up controller',
  () => {
    it(
      'Should return 400 error if email is missing',
      async () => {
        const server = await createServer();
        const response = await server.inject({
          body: {
            firstName: USER_FIRSTNAME,
            lastName: USER_LASTNAME,
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
            firstName: USER_FIRSTNAME,
            lastName: USER_LASTNAME,
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
            firstName: USER_FIRSTNAME,
            lastName: USER_LASTNAME,
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
      'Should return 400 error if first name is missing',
      async () => {
        const server = await createServer();
        const response = await server.inject({
          body: {
            email: USER_EMAIL,
            lastName: USER_LASTNAME,
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
      'Should return 400 error if last name is missing',
      async () => {
        const server = await createServer();
        const response = await server.inject({
          body: {
            email: USER_EMAIL,
            firstName: USER_FIRSTNAME,
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
      'Should return 400 error if first name or last name is too long',
      async () => {
        const server = await createServer();
        const response1 = await server.inject({
          body: {
            email: USER_EMAIL,
            firstName: USER_FIRSTNAME,
            lastName: 'verylonglastnameverylonglastnameverylonglastnameverylonglastname',
            password: USER_PASSWORD,
          },
          method: 'POST',
          path: '/api/sign-in',
        });
        const response2 = await server.inject({
          body: {
            email: USER_EMAIL,
            firstName: 'verylongfirstnameverylongfirstnameverylongfirstname',
            lastName: USER_LASTNAME,
            password: USER_PASSWORD,
          },
          method: 'POST',
          path: '/api/sign-in',
        });
        await server.close();
        assert.ok(response1.statusCode === STATUS_CODES.badRequest);
        assert.ok(response2.statusCode === STATUS_CODES.badRequest);
      },
    );
  },
);
