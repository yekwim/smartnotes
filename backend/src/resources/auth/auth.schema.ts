import Joi from 'joi';

export const signupSchema = Joi.object({
  email: Joi.string().email().max(100).required(),
  fullname: Joi.string().max(100).required(),
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(new RegExp('(?=.*[a-z])')) 
    .pattern(new RegExp('(?=.*[A-Z])')) 
    .pattern(new RegExp('(?=.*[0-9])')) 
    .pattern(new RegExp('(?=.*[!@#$%^&*])')) 
    .required()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});