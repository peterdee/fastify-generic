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
  'Test signing in',
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

    it(
      'Should return 401 error if email is unknown',
      async () => {
        const { fastifyServer: server } = resources;
        const response = await server.inject({
          body: {
            email: `new${USER_DATA.email}`,
            password: USER_DATA.password,
          },
          method: 'POST',
          path: '/api/sign-in',
        });
        assert.ok(response.statusCode === STATUS_CODES.unauthorized);
      },
    );

    it(
      'Should return 401 error if password is invalid',
      async () => {
        const { fastifyServer: server } = resources;
        const response = await server.inject({
          body: {
            email: USER_DATA.email,
            password: 'invalid',
          },
          method: 'POST',
          path: '/api/sign-in',
        });
        assert.ok(response.statusCode === STATUS_CODES.unauthorized);
      },
    );

    it(
      'Should sign user in if provided data is valid',
      async () => {
        const { fastifyServer: server } = resources;
        const response = await server.inject({
          body: {
            email: USER_DATA.email,
            password: USER_DATA.password,
          },
          method: 'POST',
          path: '/api/sign-in',
        });
        assert.ok(response.statusCode === STATUS_CODES.ok);

        const payload = await response.json();
        const { data } = payload;
        assert.ok(data);

        const { tokens, user } = data;
        assert.ok(tokens && tokens.accessToken && tokens.refreshToken);
        assert.ok(user && user[ID_FIELD] === resources.user[ID_FIELD].toString());

        const storedRefreshToken = await database
          .db
          .collection(database.collections.RefreshToken)
          .findOne({ tokenString: tokens.refreshToken });
        assert.ok(storedRefreshToken);

        const cachedUserSecret = await rc.client.get(
          rc.keyFormatter(
            rc.prefixes.secret,
            user[ID_FIELD],
          ),
        );
        assert.ok(cachedUserSecret);
      },
    );
  },
);
