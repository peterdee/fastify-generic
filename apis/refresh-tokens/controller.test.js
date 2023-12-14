import assert from 'node:assert';
import { describe, it } from 'node:test';

// import configuration from '../../configuration/index.js';
import createServer from '../../server.js';
// import { createToken } from '../../utilities/jwt.js';
import { STATUS_CODES } from '../../constants/index.js';

// const TOKEN_SECRET = 'super-secret-string';
// const USER_ID = 'some-id';

describe(
  'Test refresh tokens controller',
  () => {
    it(
      'Should return 400 error if refresh token is missing',
      async () => {
        // const SAMPLE_TOKEN = await createToken(
        //   USER_ID,
        //   TOKEN_SECRET,
        //   configuration.REFRESH_TOKEN_EXPIRATION_SECONDS,
        // );
        const server = await createServer();
        const response = await server.inject({
          method: 'POST',
          path: '/api/refresh-tokens',
        });
        await server.close();
        assert.ok(response.statusCode === STATUS_CODES.badRequest);
      },
    );
  },
);
