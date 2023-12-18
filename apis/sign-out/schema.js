import joi from 'joi';

export default joi.object({
  refreshToken: joi.string().trim(true).required(),
}).unknown();
