import assert from 'node:assert';
import { describe, it } from 'node:test';

import { createToken } from './jwt.js';

const TOKEN_SECRET = 'simple-secret';

describe(
  'Testing JWT functions',
  () => {
    it(
      'Should create a new token if arguments are passed',
      async () => {
        const token = await createToken(1, TOKEN_SECRET);
        assert.ok(token);
      },
    );
  },
);
