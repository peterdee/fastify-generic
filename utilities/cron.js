import { CronJob } from 'cron';

import createTimestamp from './create-timestamp.js';
import database from '../database/index.js';
import logger from './logger.js';

export default CronJob.from({
  cronTime: '0 0 0 * * *',
  onTick: async () => {
    const now = createTimestamp();
    const { acknowledged, deletedCount } = await database
      .db
      .collection(database.collections.RefreshToken)
      .deleteMany({
        expiresAt: {
          $lt: now,
        },
      });
    if (acknowledged) {
      logger(`CRON: expired refresh tokens deleted: ${deletedCount}`);
    }
  },
  runOnInit: false,
  timeZone: 'Europe/London',
});
