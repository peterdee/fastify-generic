import assert from 'node:assert';
import { describe, it } from 'node:test';

import createServer from '../../server.js';
import { STATUS_CODES } from '../../constants/index.js';

/** @typedef {User} */
const USER = {
  email: 'test@test.com',
  firstName: 'test',
  lastName: 'test',
  password: 'test',
};

describe(
  'Test password changing',
  () => {
    it(
      'Should allow user to change password',
      async () => {
        const server = await createServer();
        const signUpResponse = await server.inject({
          body: USER,
          method: 'POST',
          path: '/api/sign-up',
        });
        const responsePayload = signUpResponse.json();
        assert.ok(
          responsePayload && responsePayload.status === STATUS_CODES.ok && responsePayload.data,
        );

        const { tokens } = responsePayload.data;
        assert.ok(tokens && tokens.accessToken);

        // if some data is missing
        const changePasswordResponse1 = await server.inject({
          body: {
            newPassword: 'new-password',
          },
          headers: { authorization: tokens.accessToken },
          method: 'PATCH',
          path: '/api/change-password',
        });
        assert.ok(changePasswordResponse1.statusCode === STATUS_CODES.badRequest);

        // if old password is invalid
        const changePasswordResponse2 = await server.inject({
          body: {
            newPassword: 'new-password',
            oldPassword: `${USER.password}-invalid`,
          },
          headers: { authorization: tokens.accessToken },
          method: 'PATCH',
          path: '/api/change-password',
        });
        assert.ok(changePasswordResponse2.statusCode === STATUS_CODES.badRequest);

        // if everything is valid
        const changePasswordResponse3 = await server.inject({
          body: {
            newPassword: 'new-password',
            oldPassword: USER.password,
          },
          headers: { authorization: tokens.accessToken },
          method: 'PATCH',
          path: '/api/change-password',
        });
        assert.ok(changePasswordResponse3.statusCode === STATUS_CODES.ok);

        await server.close();
      },
    );
  },
);
