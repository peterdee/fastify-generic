import { MongoClient } from 'mongodb';

import configuration from '../configuration/index.js';
import { ENVS } from '../constants/index.js';
import logger from '../utilities/logger.js';

export * from './types.js';

class DatabaseConnection {
  /** @type {DatabaseClient} */
  client = null;

  collections = {
    Password: 'Password',
    RefreshToken: 'RefreshToken',
    User: 'User',
    UserSecret: 'UserSecret',
  };

  /** @type {DatabaseInstance} */
  db = null;

  transactionOptions = {
    readConcern: { level: 'snapshot' },
    readPreference: 'primary',
    writeConcern: { w: 'majority' },
  };

  async connect(connectionString = '', databaseName = '', connectionOptions = {}) {
    if (!this.client) {
      let actualConnectionString = connectionString;
      if (configuration.APP_ENV === ENVS.testing) {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        actualConnectionString = mongoServer.getUri();
      }
      this.client = new MongoClient(actualConnectionString, connectionOptions);
      await this.client.connect();
      this.db = this.client.db(databaseName);

      logger(
        `MongoDB connected${configuration.APP_ENV === ENVS.testing ? ' [TESTING]' : ''}`,
      );
    }
  }
}

export default new DatabaseConnection();
