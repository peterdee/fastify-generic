import {
  after,
  before,
  describe,
  it,
} from 'node:test';
import assert from 'node:assert';
import { MongoMemoryServer } from 'mongodb-memory-server';

import configuration from '../../configuration/index.js';
import createServer from '../../server.js';
import {
  connectDatabases,
  createUser,
  USER_DATA,
} from '../../utilities/testing-helpers.js';
import loadEnvFile from '../../utilities/load-env-file.js';
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
  'Test password changing',
  () => {
    after(async () => {
      await resources.fastifyServer.close();
      await resources.mongoServer.stop({ doCleanup: true });
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
    });

    it(
      'Should not allow user to change password if data is missing',
      async () => {
        const { accessToken, fastifyServer: server } = resources;

        const changePasswordResponse = await server.inject({
          body: {
            newPassword: 'new-password',
          },
          headers: { authorization: accessToken },
          method: 'PATCH',
          path: '/api/change-password',
        });
        assert.ok(changePasswordResponse.statusCode === STATUS_CODES.badRequest);
      },
    );

    it(
      'Should not allow user to change password if old password is invalid',
      async () => {
        const { accessToken, fastifyServer: server } = resources;

        const changePasswordResponse = await server.inject({
          body: {
            newPassword: 'new-password',
            oldPassword: `${USER_DATA.password}-invalid`,
          },
          headers: { authorization: accessToken },
          method: 'PATCH',
          path: '/api/change-password',
        });
        assert.ok(changePasswordResponse.statusCode === STATUS_CODES.badRequest);
      },
    );

    it(
      'Should change password if all provided data is valid',
      async () => {
        const { accessToken, fastifyServer: server } = resources;

        const changePasswordResponse = await server.inject({
          body: {
            newPassword: 'new-password',
            oldPassword: USER_DATA.password,
          },
          headers: { authorization: accessToken },
          method: 'PATCH',
          path: '/api/change-password',
        });
        assert.ok(changePasswordResponse.statusCode === STATUS_CODES.ok);
      },
    );
  },
);
