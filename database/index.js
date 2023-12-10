import { MongoClient } from 'mongodb';

import logger from '../utilities/logger.js';
import './types.js';

class DatabaseConnection {
  /** @type {DatabaseClient} */
  client = null;

  /** @type {DatabaseInstance} */
  db = null;

  async connect(connectionString = '', databaseName = '', connectionOptions = {}) {
    // TODO: possibly there's a better way to check client connection
    if (!this.client) {
      this.client = new MongoClient(connectionString, connectionOptions);
      await this.client.connect();
      logger('Database connected');
      this.db = this.client.db(databaseName);
    }
  }
}

export default new DatabaseConnection();
