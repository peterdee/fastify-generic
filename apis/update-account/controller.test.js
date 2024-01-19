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
import database from '../../database/index.js';
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

const UPDATE_STRING = 'updated';

describe(
  'Test updating own account',
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
    });

    it(
      'Should not update account if access token is missing',
      async () => {
        const { fastifyServer: server } = resources;
        const response = await server.inject({
          body: {
            firstName: UPDATE_STRING,
            lastName: UPDATE_STRING,
          },
          method: 'PATCH',
          path: '/api/update-account',
        });
        assert.ok(response.statusCode === STATUS_CODES.unauthorized);
      },
    );

    it(
      'Should not update account if both first name and last name are missing',
      async () => {
        const { accessToken, fastifyServer: server } = resources;
        const response = await server.inject({
          headers: {
            authorization: accessToken,
          },
          method: 'PATCH',
          path: '/api/update-account',
        });
        assert.ok(response.statusCode === STATUS_CODES.badRequest);
      },
    );

    it(
      'Should update account if data is valid',
      async () => {
        const { accessToken, fastifyServer: server, user } = resources;
        const response = await server.inject({
          body: {
            firstName: UPDATE_STRING,
            lastName: UPDATE_STRING,
          },
          headers: {
            authorization: accessToken,
          },
          method: 'PATCH',
          path: '/api/update-account',
        });
        assert.ok(response.statusCode === STATUS_CODES.ok);

        const updatedAccount = await database
          .db
          .collection(database.collections.User)
          .findOne({ [ID_FIELD]: new ObjectId(user[ID_FIELD]) });
        assert.ok(updatedAccount);
      },
    );
  },
);
