import { RESPONSE_MESSAGES, STATUS_CODES } from '../constants/index.js';

export default class CustomError extends Error {
  info;

  status;

  constructor(params = {
    info: RESPONSE_MESSAGES.internalServerError,
    status: STATUS_CODES.internalServerError,
  }) {
    super(params.info);
    this.info = params.info;
    this.status = params.status;
  }
}
