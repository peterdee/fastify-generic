import { config } from 'dotenv';

import logger from './logger.js';

export default function loadEnvFile() {
  const { error, parsed } = config();
  if (error) {
    throw error;
  }
  if (parsed && !('APP_ENV' in parsed)) {
    parsed.APP_ENV = process.env.APP_ENV;
  }
  logger(`Loaded .env file [${parsed.APP_ENV.toUpperCase()}]`);
  return parsed;
}
