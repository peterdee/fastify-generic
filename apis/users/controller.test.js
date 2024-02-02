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
  'Test getting user accounts',
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

      await Promise.all([
        createUser(),
        createUser(),
        createUser(),
        createUser(),
        createUser(),
        createUser(),
        createUser(),
        createUser(),
        createUser(),
        createUser(),
      ]);
    });

    it(
      'Should not return user data if access token is missing',
      async () => {
        const { fastifyServer: server } = resources;
        const response = await server.inject({
          method: 'GET',
          path: '/api/users',
        });
        assert.ok(response.statusCode === STATUS_CODES.unauthorized);
      },
    );

    it(
      'Should return paginated user data',
      async () => {
        const { accessToken, fastifyServer: server } = resources;
        const response = await server.inject({
          headers: {
            authorization: accessToken,
          },
          method: 'GET',
          path: '/api/users?page=2&limit=4',
        });
        assert.ok(response.statusCode === STATUS_CODES.ok);

        const payload = await response.json();
        assert.ok(payload && payload.data);

        const { pagination, values } = payload.data;
        assert.ok(values.length === 4);
        assert.ok(pagination.currentPage === 2 && pagination.totalCount === 10);
      },
    );

    it(
      'Should not return own account data',
      async () => {
        const { accessToken, fastifyServer: server, user } = resources;
        const response = await server.inject({
          headers: {
            authorization: accessToken,
          },
          method: 'GET',
          path: '/api/users?limit=20',
        });
        assert.ok(response.statusCode === STATUS_CODES.ok);

        const payload = await response.json();
        assert.ok(payload && payload.data);

        const { pagination, values } = payload.data;
        assert.ok(pagination.currentPage === 1 && pagination.totalCount === 10);
        assert.ok(values.length === 10);

        let idPresent = false;
        values.forEach((account) => {
          if (account[ID_FIELD].toString() === user[ID_FIELD].toString()) {
            idPresent = true;
          }
        });
        assert.ok(!idPresent);
      },
    );
  },
);
