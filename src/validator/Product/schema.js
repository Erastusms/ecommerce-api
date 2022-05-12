const Joi = require('joi');

const productSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.any().required(),
  quantity: Joi.number().integer().required(),
  price: Joi.number().integer().required(),
  discount: Joi.number().integer().optional(),
  kategoriId: Joi.number().integer().required()
});

const commentsSchema = Joi.object({
  comment: Joi.string().required(),
  image: Joi.any().optional(),
  rating: Joi.number().integer().required()
});

module.exports = {
  productSchema,
  commentsSchema
};
