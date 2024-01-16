import {
  after,
  before,
  describe,
  it,
} from 'node:test';
import assert from 'node:assert';

import configuration from '../../configuration/index.js';
import createServer from '../../server.js';
import loadEnvFile from '../../utilities/load-env-file.js';
import { STATUS_CODES } from '../../constants/index.js';
import '../../types.js';

/** @type {TestingResources} */
const resources = { fastifyServer: null };

describe(
  'Test index controller',
  () => {
    after(async () => {
      await resources.fastifyServer.close();
    });

    before(async () => {
      configuration.init(loadEnvFile());

      resources.fastifyServer = await createServer(configuration.APP_ENV);
    });

    it(
      'Should return 200 on index routes',
      async () => {
        const { fastifyServer: server } = resources;
        const response1 = await server.inject({
          method: 'GET',
          path: '/',
        });
        assert.ok(response1.statusCode === STATUS_CODES.ok);

        const response2 = await server.inject({
          method: 'GET',
          path: '/api',
        });
        assert.ok(response2.statusCode === STATUS_CODES.ok);
      },
    );
  },
);
