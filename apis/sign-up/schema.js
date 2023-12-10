import joi from 'joi';

export default joi.object({
  email: joi.string().trim(true).email().required(),
  firstName: joi.string().trim(true).max(48).required(),
  lastName: joi.string().trim(true).max(48).required(),
  password: joi.string().trim(true).required(),
});
