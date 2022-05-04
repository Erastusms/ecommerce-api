const Joi = require('joi');
// const { ACTION, GENDER } = require('../../constant');

const addProductSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.any().required(),
  quantity: Joi.number().integer().required(),
  price: Joi.number().integer().required(),
  discount: Joi.number().integer().optional()
});

// const ChangeAvatarSchema = Joi.object({
//   action: Joi.string().valid(...Object.values(ACTION)).required(),
//   avatarUrl: Joi.any().optional()
// });

module.exports = {
  addProductSchema
  // ChangeAvatarSchema,
};
