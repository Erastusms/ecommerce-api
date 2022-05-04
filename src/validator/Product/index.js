const { addProductSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const ProductValidator = {
  validateAddProductPayload: (payload) => {
    const validationResult = addProductSchema.validate(payload);
    if (validationResult.error) throw new InvariantError(validationResult.error.message);
  }
};

module.exports = ProductValidator;
