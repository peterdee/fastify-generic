import joi from 'joi';

export default joi.object({
  newPassword: joi.string().trim(true).required(),
  oldPassword: joi.string().trim(true).required(),
});
