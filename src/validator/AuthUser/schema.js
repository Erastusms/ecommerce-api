const Joi = require('joi').extend(require('@joi/date'));
const { MAX_LENGTH_STRING, GENDER } = require('../../constant');

const RegisterSchema = Joi.object({
  username: Joi.string().max(MAX_LENGTH_STRING).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  fullname: Joi.string().required(),
  phoneNumber: Joi.number().integer().required(),
  address: Joi.string().required(),
  postalCode: Joi.string().required(),
  country: Joi.string().required(),
  birthdate: Joi.date().format('YYYY-MM-DD').raw().required(),
  gender: Joi.string().valid(...Object.values(GENDER)).required(),
  avatarUrl: Joi.any().optional(),  
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
