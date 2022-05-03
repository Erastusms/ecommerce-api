const fs = require('fs');
const path = require('path');
const { successResponse } = require('../../response');
const { getConstUpdate, ACTION, FILE_URL, FILE_DIR } = require('../../constant');
const FileHelpers = require('../../helpers/FileHelpers');

class HandlerProfile {
  constructor(service, authService, validator) {
    this._service = service;
    this._authService = authService;
    this._validator = validator;

    this.detailProfileHandler = this.detailProfileHandler.bind(this);
    this.editProfileHandler = this.editProfileHandler.bind(this);
    this.changeAvatarHandler = this.changeAvatarHandler.bind(this);
  }

  async detailProfileHandler(request, reply) {
    const { id } = request.auth.credentials;
    const data = await this._service.showDetail(id);
    return reply.response(successResponse('Show Detail Profile', data));
  }

  async editProfileHandler(request, reply) {
    this._validator.validateEditProfilePayload(request.payload);
    await this._authService.verifyToken(request.auth.credentials);
    return reply.response(successResponse(getConstUpdate('profile')));
  }

  async changeAvatarHandler(request, reply) {
    this._validator.validateChangeAvataPayload(request.payload);
    const { id } = request.auth.credentials;
    const { action, avatarUrl } = request.payload;
    const staticFileLocation = `${FILE_URL.avatar}/avatar-anonymous.png`;
    let fileLocation = staticFileLocation;

    if (action === ACTION.UPDATE) {
      await FileHelpers.verifyFileExt(avatarUrl);
      const payloadFile = {
        file: avatarUrl,
        meta: avatarUrl.hapi,
        folderDir: FILE_DIR.avatar,
        fileType: 'avatar'
      };
      const filename = await FileHelpers.writeFile(payloadFile);
      fileLocation = `${FILE_URL.avatar}/${filename}`;
    }
    const getOldAvatarUrl = await this._service.getOldAvatar(id);
    if (getOldAvatarUrl !== staticFileLocation) {
      const imageName = getOldAvatarUrl.split('/')[5];
      await fs.promises.unlink(path.join(`assets/profilePicture/${imageName}`));
    }

    await this._service.addFileUpload(id, fileLocation);
    return reply.response(successResponse(getConstUpdate('Avatar')));
  }
}

module.exports = HandlerProfile;
