import assert from 'node:assert';
import { describe, it } from 'node:test';

import { createToken, decodeToken, verifyToken } from './jwt.js';

const TOKEN_EXPIRATION = 5;
const TOKEN_SECRET = 'simple-secret';
const USER_ID = 1;

describe(
  'Testing JWT functions',
  () => {
    it(
      'Should create a new token if all arguments are passed',
      async () => {
        const token = await createToken(USER_ID, TOKEN_SECRET, TOKEN_EXPIRATION);
        assert.ok(token);
      },
    );

    it(
      'Should return an empty string if one or all arguments are missing',
      async () => {
        const temp1 = await createToken();
        assert.ok(!temp1);
        const temp2 = await createToken(USER_ID);
        assert.ok(!temp2);
        const temp3 = await createToken(USER_ID, TOKEN_SECRET);
        assert.ok(!temp3);
      },
    );

    it(
      'Should decode token',
      async () => {
        const token = await createToken(USER_ID, TOKEN_SECRET, TOKEN_EXPIRATION);
        const decoded = decodeToken(token);
        assert.ok(decoded.id === USER_ID);
      },
    );

    it(
      'Should not decoded token if it was modified',
      async () => {
        const token = await createToken(USER_ID, TOKEN_SECRET, 0);
        const partials = token.split('.');
        const payload = partials[1];
        const modifiedToken = `${partials[0]}${`${payload}modified`}${partials[2]}`;
        try {
          decodeToken(modifiedToken);
        } catch (error) {
          assert.ok(error.message === 'jwt malformed');
        }
      },
    );

    it(
      'Should verify token if it was not modified',
      async () => {
        const token = await createToken(USER_ID, TOKEN_SECRET, TOKEN_EXPIRATION);
        const decoded = await verifyToken(token, TOKEN_SECRET);
        assert.ok(decoded.id === USER_ID);
      },
    );

    it(
      'Should not verify token if it was signed with a different secret',
      async () => {
        const token = await createToken(USER_ID, 'invalid-secret', TOKEN_EXPIRATION);
        try {
          await verifyToken(token, TOKEN_SECRET);
        } catch (error) {
          assert.ok(error.message === 'invalid signature');
        }
      },
    );

    it(
      'Should not verify token if it is expired',
      async () => {
        const token = await createToken(USER_ID, TOKEN_SECRET, 0);
        try {
          await verifyToken(token, TOKEN_SECRET);
        } catch (error) {
          assert.ok(error.message === 'jwt expired');
        }
      },
    );

    it(
      'Should not verify token if it was modified',
      async () => {
        const token = await createToken(USER_ID, TOKEN_SECRET, 0);
        const partials = token.split('.');
        const payload = partials[1];
        const modifiedToken = `${partials[0]}${`${payload}modified`}${partials[2]}`;
        try {
          await verifyToken(modifiedToken, TOKEN_SECRET);
        } catch (error) {
          assert.ok(error.message === 'jwt malformed');
        }
      },
    );
  },
);
