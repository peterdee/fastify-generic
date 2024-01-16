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
  'Test deleting own account',
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
      'Should delete user record in the MongoDB and all of the associated records',
      async () => {
        const { accessToken, fastifyServer: server, user } = resources;

        const deleteAccountResponse = await server.inject({
          headers: { authorization: accessToken },
          method: 'DELETE',
          path: '/api/delete-account',
        });
        assert.ok(deleteAccountResponse.statusCode === STATUS_CODES.ok);

        const [
          userRecord,
          userPasswordRecord,
          userRefreshTokenRecord,
          userSecretRecord,
        ] = await Promise.all([
          database
            .db
            .collection(database.collections.User)
            .findOne({ [ID_FIELD]: user[ID_FIELD] }),
          database
            .db
            .collection(database.collections.Password)
            .findOne({ userId: user[ID_FIELD] }),
          database
            .db
            .collection(database.collections.RefreshToken)
            .findOne({ userId: user[ID_FIELD] }),
          database
            .db
            .collection(database.collections.UserSecret)
            .findOne({ userId: user[ID_FIELD] }),
        ]);
        assert.ok(!userRecord);
        assert.ok(!userPasswordRecord);
        assert.ok(!userRefreshTokenRecord);
        assert.ok(!userSecretRecord);
      },
    );

    it(
      'Should not store user secret in Redis after deleting',
      async () => {
        const { user } = resources;
        const userSecret = await rc.client.get(rc.keyFormatter(rc.prefixes.secret, user[ID_FIELD]));
        assert.ok(!userSecret);
      },
    );
  },
);
