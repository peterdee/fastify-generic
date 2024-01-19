import {
  after,
  before,
  describe,
  it,
} from 'node:test';
import assert from 'node:assert';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ObjectId } from 'mongodb';

import configuration from '../../configuration/index.js';
import { connectDatabases, createUser } from '../../utilities/testing-helpers.js';
import createServer from '../../server.js';
import { ID_FIELD, STATUS_CODES } from '../../constants/index.js';
import loadEnvFile from '../../utilities/load-env-file.js';
import '../../types.js';

/** @type {TestingResources} */
const resources = {
  accessToken: '',
  customData: {},
  fastifyServer: null,
  mongoServer: null,
  user: null,
};

describe(
  'Test getting user account',
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
        redisConnectionString: configuration.REDIS_TEST_CONNECTION_STRING,
      });
      resources.fastifyServer = await createServer(configuration.APP_ENV);

      const { accessToken, user } = await createUser();
      resources.accessToken = accessToken;
      resources.user = user;

      const { user: targetUser } = await createUser();
      resources.customData = targetUser;
    });

    it(
      'Should not return user data if access token is missing',
      async () => {
        const { customData, fastifyServer: server } = resources;
        const response = await server.inject({
          method: 'GET',
          path: `/api/user/${customData[ID_FIELD]}`,
        });
        assert.ok(response.statusCode === STATUS_CODES.unauthorized);
      },
    );

    it(
      'Should not return user data if provided User ID is not a valid Object ID',
      async () => {
        const { accessToken, fastifyServer: server } = resources;
        const response = await server.inject({
          headers: {
            authorization: accessToken,
          },
          method: 'GET',
          path: '/api/user/abc',
        });
        assert.ok(response.statusCode === STATUS_CODES.badRequest);
      },
    );

    it(
      'Should not return user data if provided User ID does not exist',
      async () => {
        const { accessToken, fastifyServer: server } = resources;
        const response = await server.inject({
          headers: {
            authorization: accessToken,
          },
          method: 'GET',
          path: `/api/user/${new ObjectId(999)}`,
        });
        assert.ok(response.statusCode === STATUS_CODES.badRequest);
      },
    );

    it(
      'Should return user data if provided User ID is valid',
      async () => {
        const { accessToken, customData, fastifyServer: server } = resources;
        const response = await server.inject({
          headers: {
            authorization: accessToken,
          },
          method: 'GET',
          path: `/api/user/${customData[ID_FIELD]}`,
        });
        assert.ok(response.statusCode === STATUS_CODES.ok);
      },
    );
  },
);
