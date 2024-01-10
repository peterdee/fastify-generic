import {
  after,
  before,
  describe,
  it,
} from 'node:test';
import assert from 'node:assert';
import { MongoMemoryServer } from 'mongodb-memory-server';

import createServer from '../../server.js';
import { createUser, USER_DATA } from '../../utilities/testing-helpers.js';
import database from '../../database/index.js';
import { STATUS_CODES } from '../../constants/index.js';
import '../../types.js';

/** @type {TestingResources} */
const resources = {
  accessToken: '',
  fastifyServer: null,
  mongoServer: null,
  user: null,
};

describe(
  'Test signing in',
  () => {
    after(async () => {
      await resources.fastifyServer.close();
      await resources.mongoServer.stop();
    });

    before(async () => {
      resources.mongoServer = await MongoMemoryServer.create();
      await database.connect({
        APP_ENV: process.env.APP_ENV,
        connectionString: resources.mongoServer.getUri(),
        databaseName: 'test',
      });
      resources.fastifyServer = await createServer();

      const { refreshToken, user } = await createUser();
      resources.refreshToken = refreshToken;
      resources.user = user;
    });

    it(
      'Should return 400 error if email is missing',
      async () => {
        const { fastifyServer: server } = resources;
        const response = await server.inject({
          body: {
            password: USER_DATA.password,
          },
          method: 'POST',
          path: '/api/sign-in',
        });
        assert.ok(response.statusCode === STATUS_CODES.badRequest);
      },
    );

    it(
      'Should return 400 error if password is missing',
      async () => {
        const { fastifyServer: server } = resources;
        const response = await server.inject({
          body: {
            email: USER_DATA.email,
          },
          method: 'POST',
          path: '/api/sign-in',
        });
        assert.ok(response.statusCode === STATUS_CODES.badRequest);
      },
    );

    it(
      'Should return 400 error if email is invalid',
      async () => {
        const { fastifyServer: server } = resources;
        const response = await server.inject({
          body: {
            email: 'email@invalid',
            password: USER_DATA.password,
          },
          method: 'POST',
          path: '/api/sign-in',
        });
        assert.ok(response.statusCode === STATUS_CODES.badRequest);
      },
    );
  },
);
