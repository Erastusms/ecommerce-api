const { EditProfileSchema, ChangeAvatarSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const ProfileValidator = {
  validateEditProfilePayload: (payload) => {
    const validationResult = EditProfileSchema.validate(payload);
    if (validationResult.error) throw new InvariantError(validationResult.error.message);
  },
  validateChangeAvataPayload: (payload) => {
    const validationResult = ChangeAvatarSchema.validate(payload);
    if (validationResult.error) throw new InvariantError(validationResult.error.message);
  }
};

module.exports = ProfileValidator;
