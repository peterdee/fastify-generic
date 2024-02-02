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
import { createToken } from '../../utilities/jwt.js';
import createServer from '../../server.js';
import createTimestamp from '../../utilities/create-timestamp.js';
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

describe(
  'Test token refreshing',
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

      const { refreshToken, user } = await createUser();
      resources.refreshToken = refreshToken;
      resources.user = user;
    });

    it(
      'Should not refresh tokens if refresh token was not provided',
      async () => {
        const { fastifyServer: server } = resources;

        const refreshTokensResponse = await server.inject({
          method: 'POST',
          path: '/api/refresh-tokens',
        });
        assert.ok(refreshTokensResponse.statusCode === STATUS_CODES.badRequest);
      },
    );

    it(
      'Should not refresh tokens if refresh token is invalid',
      async () => {
        const { fastifyServer: server } = resources;

        const refreshTokensResponse = await server.inject({
          body: { refreshToken: 'invalid-string' },
          method: 'POST',
          path: '/api/refresh-tokens',
        });
        assert.ok(refreshTokensResponse.statusCode === STATUS_CODES.unauthorized);
      },
    );

    it(
      'Should not refresh tokens if refresh token has expired',
      async () => {
        const { fastifyServer: server, user } = resources;

        /** @type {UserSecret} */
        const secretRecord = await database
          .db
          .collection(database.collections.UserSecret)
          .findOne({ userId: user[ID_FIELD] });
        const expiredRefreshToken = await createToken(
          user[ID_FIELD].toString(),
          secretRecord.secretString,
          1,
        );

        const now = createTimestamp();

        await database
          .db
          .collection(database.collections.RefreshToken)
          .insertOne({
            createdAt: now,
            expiresAt: now + 1,
            tokenString: expiredRefreshToken,
            updatedAt: now,
            userId: user[ID_FIELD],
          });

        await new Promise((resolve) => {
          setTimeout(() => resolve(), 1000);
        });

        const refreshTokensResponse = await server.inject({
          body: { refreshToken: expiredRefreshToken },
          method: 'POST',
          path: '/api/refresh-tokens',
        });
        assert.ok(refreshTokensResponse.statusCode === STATUS_CODES.unauthorized);

        const expiredTokenRecord = await database
          .db
          .collection(database.collections.RefreshToken)
          .findOne({
            tokenString: expiredRefreshToken,
          });
        assert.ok(!expiredTokenRecord);
      },
    );

    it(
      'Should refresh tokens if refresh token was provided',
      async () => {
        const { refreshToken, fastifyServer: server } = resources;

        const refreshTokensResponse = await server.inject({
          body: { refreshToken },
          method: 'POST',
          path: '/api/refresh-tokens',
        });
        assert.ok(refreshTokensResponse.statusCode === STATUS_CODES.ok);

        const payload = await refreshTokensResponse.json();
        assert.ok(payload);

        const {
          data: {
            tokens: {
              accessToken: newAccessToken = '',
              refreshToken: newRefreshToken = '',
            } = {},
          } = {},
        } = payload;
        assert.ok(newAccessToken && newRefreshToken);

        /** @type {RefreshToken} */
        const savedToken = await database
          .db
          .collection(database.collections.RefreshToken)
          .findOne({ tokenString: newRefreshToken });
        assert.ok(savedToken);
      },
    );
  },
);
