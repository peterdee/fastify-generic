import { compare, hash } from 'scryptwrap';

/**
 * Compare hashes
 * @param {string} plaintext original string
 * @param {string} hashed hashed string
 * @returns {Promise<boolean>}
 */
export function compareHashes(plaintext, hashed) {
  return compare(hashed, plaintext);
}

/**
 * Create new hash from a string
 * @param {string} plaintext original string
 * @returns {Promise<string>}
 */
export function createHash(plaintext) {
  return hash(plaintext);
}
