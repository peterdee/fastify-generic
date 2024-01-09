import assert from 'node:assert';
import {
  after,
  before,
  describe,
  it,
} from 'node:test';
import { MongoMemoryServer } from 'mongodb-memory-server';

import createServer from '../../server.js';
import { createUser } from '../../utilities/testing-helpers.js';
import database from '../../database/index.js';
import { ID_FIELD, STATUS_CODES } from '../../constants/index.js';
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
      'Should delete user record in the MongoDB and all of the associated records',
      async () => {
        const { accessToken, fastifyServer: server, user } = resources;

        const changePasswordResponse = await server.inject({
          headers: { authorization: accessToken },
          method: 'DELETE',
          path: '/api/delete-account',
        });
        assert.ok(changePasswordResponse.statusCode === STATUS_CODES.ok);

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
