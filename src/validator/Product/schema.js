const Joi = require('joi');

const productSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.any().required(),
  quantity: Joi.number().integer().required(),
  price: Joi.number().integer().required(),
  discount: Joi.number().integer().optional()
});

module.exports = {
  productSchema
};
