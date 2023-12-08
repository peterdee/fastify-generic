import joi from 'joi';

export default joi.object({
  email: joi.string().trim(true).email().required(),
  password: joi.string().trim(true).required(),
});
