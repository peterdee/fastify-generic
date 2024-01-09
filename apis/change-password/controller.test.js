import assert from 'node:assert';
import {
  after,
  before,
  describe,
  it,
} from 'node:test';
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
  'Test password changing',
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

        const changePasswordResponse3 = await server.inject({
          body: {
            newPassword: 'new-password',
            oldPassword: USER_DATA.password,
          },
          headers: { authorization: accessToken },
          method: 'PATCH',
          path: '/api/change-password',
        });
        assert.ok(changePasswordResponse3.statusCode === STATUS_CODES.ok);
      },
    );
  },
);
