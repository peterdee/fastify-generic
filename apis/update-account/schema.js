import joi from 'joi';

export default joi.object({
  firstName: joi
    .string()
    .trim(true)
    .max(48)
    .optional(),
  lastName: joi
    .string()
    .trim(true)
    .max(48)
    .optional(),
});
