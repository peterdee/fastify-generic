import jwt from 'jsonwebtoken';

/**
 * Create new token for user
 * @param {number | string} userId user identifier
 * @param {string} userSecret user secret string
 * @returns {Promise<string>}
 */
export async function createToken(userId, userSecret) {
  return new Promise((resolve) => {
    jwt.sign(
      {
        id: userId,
      },
      userSecret,
      {
        expiresIn: 4,
      },
      (error, encoded) => {
        if (error) {
          return resolve('');
        }
        return resolve(encoded);
      },
    );
  });
}

/**
 * Decode token without verification
 * @param {string} token JWT
 * @returns {{ id: number | string }}
 */
export async function decodeToken(token) {
  return jwt.decode(token);
}

/**
 * Verify token and return the payload
 * @param {string} token JWT
 * @param {string} userSecret user secret string
 * @returns {Promise<{ id: number | string } | Error>}
 */
export async function verifyToken(token, userSecret) {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      userSecret,
      (error, decoded) => {
        if (error) {
          return reject(error);
        }
        return resolve(decoded);
      },
    );
  });
}
