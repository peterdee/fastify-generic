import { MongoClient } from 'mongodb';

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

  async connect({
    APP_ENV = ENVS.development,
    connectionOptions = {},
    connectionString = '',
    databaseName = '',
  }) {
    if (!this.client) {
      this.client = new MongoClient(connectionString, connectionOptions);
      await this.client.connect();
      this.db = this.client.db(databaseName);

      logger(`MongoDB connected [${APP_ENV.toUpperCase()}]`);
    }
  }
}

export default new DatabaseConnection();
