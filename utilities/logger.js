import { Console } from 'node:console';

import configuration from '../configuration/index.js';
import { ENVS } from '../constants/index.js';

const logger = new Console(process.stdout, process.stderr);

/**
 * Show console log
 * @param {...*} values
 * @returns {void}
 */
export default (...values) => {
  if (configuration.APP_ENV !== ENVS.production) {
    logger.log(`${new Date().toString()} >`, ...values);
  }
};
