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
    host,
    name,
    password,
    port,
    prefix,
    username,
  }) {
    if (!this.client) {
      let connectionString = prefix;
      if (username) {
        connectionString += username;
        if (password) {
          connectionString += `:${password}`;
        }
        connectionString += '@';
      }
      connectionString += `${host}${port ? `:${port}` : ''}/?retryWrites=true&w=majority`;
      this.client = new MongoClient(connectionString);
      await this.client.connect();
      this.db = this.client.db(name);

      logger(`MongoDB connected [${APP_ENV.toUpperCase()}]`);
    }
  }
}

export default new DatabaseConnection();
