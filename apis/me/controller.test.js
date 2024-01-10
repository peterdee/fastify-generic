import assert from 'node:assert';
import {
  after,
  before,
  describe,
  it,
} from 'node:test';
import { MongoMemoryServer } from 'mongodb-memory-server';

import createServer from '../../server.js';
import { createUser } from '../../utilities/testing-helpers.js';
import database from '../../database/index.js';
import { ID_FIELD, STATUS_CODES } from '../../constants/index.js';
import '../../types.js';

/** @type {TestingResources} */
const resources = {
  accessToken: '',
  fastifyServer: null,
  mongoServer: null,
  user: null,
};

describe(
  'Test getting own account',
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

      const { accessToken, user } = await createUser();
      resources.accessToken = accessToken;
      resources.user = user;
    });

    it(
      'Should not get user account if access token was not provided',
      async () => {
        const { fastifyServer: server } = resources;

        const getAccountResponse = await server.inject({
          method: 'GET',
          path: '/api/me',
        });
        assert.ok(getAccountResponse.statusCode === STATUS_CODES.unauthorized);
      },
    );

    it(
      'Should get user account if access token was provided',
      async () => {
        const { accessToken, fastifyServer: server, user } = resources;

        const getAccountResponse = await server.inject({
          headers: {
            authorization: accessToken,
          },
          method: 'GET',
          path: '/api/me',
        });
        assert.ok(getAccountResponse.statusCode === STATUS_CODES.ok);

        const payload = await getAccountResponse.json();
        assert.ok(payload);

        const { data: { user: userData = null } = {} } = payload;
        assert.ok(userData && userData[ID_FIELD] === user[ID_FIELD].toString());
      },
    );
  },
);
