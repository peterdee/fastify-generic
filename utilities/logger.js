import { Console } from 'node:console';

import { APP_ENV } from '../configuration/index.js';
import { ENVS } from '../constants/index.js';

const logger = new Console(process.stdout, process.stderr);

/**
 * Show console log
 * @param {...*} values
 * @returns {void}
 */
export default (...values) => {
  if (APP_ENV !== ENVS.production) {
    logger.log(`${new Date().toString()} >`, ...values);
  }
};
