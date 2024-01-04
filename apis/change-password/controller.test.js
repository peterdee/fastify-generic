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
        assert.ok(signUpResponse.payload && signUpResponse.payload.status === STATUS_CODES.ok);

        const { tokens } = signUpResponse.payload;
        assert.ok(tokens && tokens.access);

        const changePasswordResponse = await server.inject({
          body: {
            newPassword: 'new-password',
            oldPassword: `${USER.password}-invalid`,
          },
          headers: { authorization: tokens.access },
          method: 'PATCH',
          path: '/api/change-password',
        });
        await server.close();
        assert.ok(changePasswordResponse.statusCode === STATUS_CODES.ok);
      },
    );
  },
);
