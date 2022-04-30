const { RegisterSchema, LoginSchema, EditLoginSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const AuthenticationsValidator = {
  validateRegisterPayload: (payload) => {
    const validationResult = RegisterSchema.validate(payload);
    if (validationResult.error) throw new InvariantError(validationResult.error.message);
  },
  validateLoginPayload: (payload) => {
    const validationResult = LoginSchema.validate(payload);
    if (validationResult.error) throw new InvariantError(validationResult.error.message);
  },
  validateEditLoginPayload: (payload) => {
    const validationResult = EditLoginSchema.validate(payload);
    if (validationResult.error) throw new InvariantError(validationResult.error.message);
  }
};

module.exports = AuthenticationsValidator;
