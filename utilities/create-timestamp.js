/**
 * Create UNIX timestamp (seconds)
 * @returns {number}
 */
export default function createTimestamp() {
  return Math.round(Date.now() / 1000);
}
