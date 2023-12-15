import { Console } from 'node:console';

const logger = new Console(process.stdout, process.stderr);

/**
 * Show console log
 * @param {...*} values
 * @returns {void}
 */
export default (...values) => {
  logger.log(`${new Date().toString()} >`, ...values);
};
