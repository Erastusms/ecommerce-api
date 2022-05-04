const Joi = require('joi').extend(require('@joi/date'));
const { ACTION, GENDER } = require('../../constant');

const EditProfileSchema = Joi.object({
  email: Joi.string().email().required(),
  fullname: Joi.string().required(),
  phoneNumber: Joi.number().integer().required(),
  address: Joi.string().required(),
  postalCode: Joi.string().required(),
  country: Joi.string().required(),
  birthdate: Joi.date().format('YYYY-MM-DD').raw().required(),
  gender: Joi.string().valid(...Object.values(GENDER)).required()
});

const ChangeAvatarSchema = Joi.object({
  action: Joi.string().valid(...Object.values(ACTION)).required(),
  avatarUrl: Joi.any().optional()
});

module.exports = {
  EditProfileSchema,
  ChangeAvatarSchema,
};
