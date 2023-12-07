import { RESPONSE_MESSAGES, STATUS_CODES } from '../constants/index.js';

export default class CustomError extends Error {
  info;

  status;

  constructor({
    info = RESPONSE_MESSAGES.internalServerError,
    status = STATUS_CODES.internalServerError,
  }) {
    super(info);
    this.info = info;
    this.status = status;
  }
}
