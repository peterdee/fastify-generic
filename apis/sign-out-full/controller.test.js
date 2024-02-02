import {
  after,
  before,
  describe,
  it,
} from 'node:test';
import assert from 'node:assert';
import { MongoMemoryServer } from 'mongodb-memory-server';

import configuration from '../../configuration/index.js';
import {
  connectDatabases,
  createUser,
  USER_DATA,
} from '../../utilities/testing-helpers.js';
import createServer from '../../server.js';
import database from '../../database/index.js';
import { ID_FIELD, STATUS_CODES } from '../../constants/index.js';
import loadEnvFile from '../../utilities/load-env-file.js';
import rc from '../../redis/index.js';
import '../../types.js';

/** @type {TestingResources} */
const resources = {
  accessToken: '',
  fastifyServer: null,
  mongoServer: null,
  user: null,
};

describe(
  'Test signing out on all devices',
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
        const { fastifyServer: server } = resources;
        const response = await server.inject({
          method: 'GET',
          path: '/api/sign-out/full',
        });
        assert.ok(response.statusCode === STATUS_CODES.unauthorized);
      },
    );

    it(
      'Should sign user out if access token was provided',
      async () => {
        const { accessToken, refreshToken, fastifyServer: server } = resources;
        const response = await server.inject({
          headers: {
            authorization: accessToken,
          },
          method: 'GET',
          path: '/api/sign-out/full',
        });
        assert.ok(response.statusCode === STATUS_CODES.ok);

        const storedRefreshToken = await database
          .db
          .collection(database.collections.RefreshToken)
          .findOne({ tokenString: refreshToken });
        assert.ok(!storedRefreshToken);
      },
    );

    it(
      'Should change user secret',
      async () => {
        const { user } = resources;
        const { secretString } = USER_DATA;

        /** @type {UserSecret} */
        const updatedSecret = await database
          .db
          .collection(database.collections.UserSecret)
          .findOne({
            userId: user[ID_FIELD],
          });
        assert.ok(updatedSecret);
        assert.ok(updatedSecret.secretString !== secretString);

        const cachedSecret = await rc.client.get(
          rc.keyFormatter(rc.prefixes.secret, user[ID_FIELD]),
        );
        assert.ok(cachedSecret);
        assert.ok(cachedSecret !== secretString);
      },
    );

    it(
      'Should not allow user to use previously created access token due to changed user secret',
      async () => {
        const { accessToken, fastifyServer: server } = resources;
        const response = await server.inject({
          headers: {
            authorization: accessToken,
          },
          method: 'GET',
          path: '/api/me',
        });
        assert.ok(response.statusCode === STATUS_CODES.unauthorized);
      },
    );
  },
);
