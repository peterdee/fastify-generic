import {
  after,
  before,
  describe,
  it,
} from 'node:test';
import assert from 'node:assert';
import { MongoMemoryServer } from 'mongodb-memory-server';

import configuration from '../../configuration/index.js';
import { connectDatabases, createUser } from '../../utilities/testing-helpers.js';
import createServer from '../../server.js';
import { ID_FIELD, STATUS_CODES } from '../../constants/index.js';
import loadEnvFile from '../../utilities/load-env-file.js';
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
      configuration.init(loadEnvFile());

      resources.mongoServer = await MongoMemoryServer.create();
      await connectDatabases({
        APP_ENV: configuration.APP_ENV,
        mongoConnectionString: resources.mongoServer.getUri(),
        redisConnectionOptions: configuration.REDIS_TEST,
      });
      resources.fastifyServer = await createServer(configuration.APP_ENV);

      const { accessToken, user } = await createUser();
      resources.accessToken = accessToken;
      resources.user = user;
    });

    it(
      'Should not get own account if access token was not provided',
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
      'Should get own account if access token was provided',
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
