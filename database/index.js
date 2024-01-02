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
    // TODO: possibly there's a better way to check client connection
    if (!this.client) {
      let actualConnectionString = connectionString;
      if (configuration.APP_ENV === ENVS.testing) {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        actualConnectionString = mongoServer.getUri();
        logger('asdasdasd');

        // TODO: check if this works properly
        // process.on('SIGINT', () => mongoServer.stop());
        // process.on('SIGTERM', () => mongoServer.stop());
      }
      this.client = new MongoClient(actualConnectionString, connectionOptions);
      await this.client.connect();
      this.db = this.client.db(databaseName);

      logger('Database connected');
    }
  }
}

export default new DatabaseConnection();
