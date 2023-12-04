import jwt from 'jsonwebtoken';

/**
 * Create new token for user
 * @param {number | string} userId user identifier
 * @param {string} tokenSecret token secret
 * @param {number} expirationSeconds token expiration
 * @returns {Promise<string>}
 */
export function createToken(userId, tokenSecret, expirationSeconds) {
  if (!(userId && tokenSecret && !Number.isNaN(expirationSeconds))) {
    return '';
  }
  return new Promise((resolve) => {
    jwt.sign(
      {
        id: userId,
      },
      tokenSecret,
      {
        expiresIn: expirationSeconds,
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
export function decodeToken(token) {
  return jwt.decode(token);
}

/**
 * Verify token and return the payload
 * @param {string} token JWT
 * @param {string} tokenSecret token secret
 * @returns {Promise<{ id: number | string } | Error>}
 */
export function verifyToken(token, tokenSecret) {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      tokenSecret,
      (error, decoded) => {
        if (error) {
          return reject(error);
        }
        return resolve(decoded);
      },
    );
  });
}
