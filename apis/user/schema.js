import joi from 'joi';

export default joi.object({
  id: joi.string().trim(true).required(),
}).unknown();
