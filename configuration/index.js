import * as constants from '../constants/index.js';

const { env: ev } = process;

export const { APP_ENV = constants.ENVS.development } = ev;

export const PORT = Number(ev.PORT) || constants.DEFAULT_PORT;
