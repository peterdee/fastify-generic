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
import database from '../../database/index.js';
import { STATUS_CODES } from '../../constants/index.js';
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
  'Test signing out',
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

      const {
        accessToken,
        refreshToken,
        user,
      } = await createUser();
      resources.accessToken = accessToken;
      resources.refreshToken = refreshToken;
      resources.user = user;
    });

    it(
      'Should not allow to sign out if access token was not provided',
      async () => {
        const { refreshToken, fastifyServer: server } = resources;
        const response = await server.inject({
          body: { refreshToken },
          method: 'POST',
          path: '/api/sign-out',
        });
        assert.ok(response.statusCode === STATUS_CODES.unauthorized);
      },
    );

    it(
      'Should not allow to sign out if refresh token is missing',
      async () => {
        const { accessToken, fastifyServer: server } = resources;
        const response = await server.inject({
          headers: {
            authorization: accessToken,
          },
          method: 'POST',
          path: '/api/sign-out',
        });
        assert.ok(response.statusCode === STATUS_CODES.badRequest);
      },
    );

    it(
      'Should sign out the user if valid data is provided',
      async () => {
        const { accessToken, refreshToken, fastifyServer: server } = resources;
        const response = await server.inject({
          body: { refreshToken },
          headers: {
            authorization: accessToken,
          },
          method: 'POST',
          path: '/api/sign-out',
        });
        assert.ok(response.statusCode === STATUS_CODES.ok);

        const storedRefreshToken = await database
          .db
          .collection(database.collections.RefreshToken)
          .findOne({ tokenString: refreshToken });
        assert.ok(!storedRefreshToken);
      },
    );
  },
);
