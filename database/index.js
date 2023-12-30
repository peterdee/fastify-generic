import { MongoClient } from 'mongodb';

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
      this.client = new MongoClient(connectionString, connectionOptions);
      await this.client.connect();
      this.db = this.client.db(databaseName);

      // TODO: add index constraints for collections if necessary
      logger('Database connected');
    }
  }
}

export default new DatabaseConnection();
