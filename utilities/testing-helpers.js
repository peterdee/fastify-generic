import configuration from '../configuration/index.js';
import { createHash } from './hashing.js';
import createTimestamp from './create-timestamp.js';
import { createToken } from './jwt.js';
import database from '../database/index.js';
import { ID_FIELD } from '../constants/index.js';
import rc from '../redis/index.js';

export const USER_DATA = {
  email: 'test@test.com',
  firstName: 'test',
  lastName: 'test',
  password: 'test',
  passwordHash: '',
  secretString: '',
};

export async function connectDatabases({
  APP_ENV,
  mongoConnectionString,
  redisConnectionOptions,
}) {
  return Promise.all([
    database.connect({
      APP_ENV,
      testConnectionString: mongoConnectionString,
    }),
    rc.connect({
      APP_ENV,
      ...redisConnectionOptions,
    }),
  ]);
}

export async function createUser() {
  const now = createTimestamp();

  /** @typedef {User} */
  const USER = {
    createdAt: now,
    email: USER_DATA.email,
    firstName: USER_DATA.firstName,
    lastName: USER_DATA.lastName,
    updatedAt: now,
  };

  const session = database.client.startSession();
  try {
    return session.withTransaction(
      async () => {
        const { insertedId: userId } = await database
          .db
          .collection(database.collections.User)
          .insertOne(USER);
        USER[ID_FIELD] = userId;

        const [passwordHash, secretString] = await Promise.all([
          createHash(USER_DATA.password),
          createHash(`${userId}${now}`),
        ]);

        USER_DATA.passwordHash = passwordHash;
        USER_DATA.secretString = secretString;

        await Promise.all([
          database
            .db
            .collection(database.collections.Password)
            .insertOne({
              createdAt: now,
              passwordHash,
              updatedAt: now,
              userId,
            }),
          database
            .db
            .collection(database.collections.UserSecret)
            .insertOne({
              createdAt: now,
              secretString,
              updatedAt: now,
              userId,
            }),
        ]);

        const [accessToken, refreshToken] = await Promise.all([
          createToken(
            userId,
            secretString,
            configuration.ACCESS_TOKEN_EXPIRATION_SECONDS,
          ),
          createToken(
            userId,
            secretString,
            configuration.REFRESH_TOKEN_EXPIRATION_SECONDS,
          ),
          rc.client.set(
            rc.keyFormatter(rc.prefixes.secret, userId),
            secretString,
            {
              EX: configuration.ACCESS_TOKEN_EXPIRATION_SECONDS,
            },
          ),
        ]);

        await database
          .db
          .collection(database.collections.RefreshToken)
          .insertOne({
            createdAt: now,
            expiresAt: now + configuration.REFRESH_TOKEN_EXPIRATION_SECONDS,
            tokenString: refreshToken,
            updatedAt: now,
            userId,
          });

        return {
          accessToken,
          refreshToken,
          user: USER,
        };
      },
      database.transactionOptions,
    );
  } finally {
    await session.endSession();
  }
}
