const Joi = require('joi');
const { MAX_LENGTH_STRING } = require('../../constant');

const RegisterSchema = Joi.object({
  username: Joi.string().max(MAX_LENGTH_STRING).required(),
  password: Joi.string().required(),
  fullname: Joi.string().required(),
});

const LoginSchema = Joi.object({
  username: Joi.string().max(MAX_LENGTH_STRING).required(),
  password: Joi.string().required(),
});

const EditLoginSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = {
  LoginSchema,
  EditLoginSchema,
  RegisterSchema
};
