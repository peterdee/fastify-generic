import { Console } from 'node:console';

import { APP_ENV } from '../configuration/index.js';
import { ENVS } from '../constants/index.js';

const logger = new Console(process.stdout, process.stderr);

export default (...strings) => {
  if (APP_ENV === ENVS.development) {
    logger.log(`${new Date().toString()} >`, ...strings);
  }
};
