import { config } from 'dotenv';

export default function loadEnvFile() {
  const { error, parsed } = config();
  if (error) {
    throw error;
  }
  if (parsed && !('APP_ENV' in parsed)) {
    parsed.APP_ENV = process.env.APP_ENV;
  }
  return parsed;
}
