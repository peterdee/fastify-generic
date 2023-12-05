import assert from 'node:assert';
import { describe, it } from 'node:test';

import { compareHashes, createHash } from './hashing.js';

const PLAINTEXT = 'plaintext-string';

describe(
  'Testing hashing functions',
  () => {
    it(
      'Should create a new hash if plaintext string is passed',
      async () => {
        const hashed = await createHash(PLAINTEXT);
        assert.ok(hashed);
      },
    );

    it(
      'Should throw an error if plaintext string is not passed when creating a hash',
      async () => {
        try {
          await createHash();
        } catch (error) {
          assert.ok(error.message === 'Hash string is empty!');
        }
      },
    );

    it(
      'Should compare hashed string with plaintext and return TRUE if they match',
      async () => {
        const hashed = await createHash(PLAINTEXT);
        const isValid = await compareHashes(PLAINTEXT, hashed);
        assert.ok(isValid);
      },
    );

    it(
      'Should compare hashed string with plaintext and return FALSE if they don\'t match',
      async () => {
        const hashed = await createHash('new-plaintext');
        const isValid = await compareHashes(PLAINTEXT, hashed);
        assert.ok(!isValid);
      },
    );

    it(
      'Should throw an error if arguments for comparison are missing',
      async () => {
        try {
          await compareHashes();
        } catch (error) {
          assert.ok(error.message === 'Hash and plaintext strings are required!');
        }
      },
    );
  },
);
