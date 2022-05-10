const { productSchema, commentsSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const ProductValidator = {
  validateProductPayload: (payload) => {
    const validationResult = productSchema.validate(payload);
    if (validationResult.error) throw new InvariantError(validationResult.error.message);
  },
  validateCommentsPayload: (payload) => {
    const validationResult = commentsSchema.validate(payload);
    if (validationResult.error) throw new InvariantError(validationResult.error.message);
  } 
};

module.exports = ProductValidator;
