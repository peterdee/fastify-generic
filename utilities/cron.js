import createTimestamp from './create-timestamp.js';
import database from '../database/index.js';
import logger from './logger.js';

export default async function deleteExpiredRefreshTokens() {
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
}
