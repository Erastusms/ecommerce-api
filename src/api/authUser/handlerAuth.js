const { successResponse } = require('../../response');
const { getConstAdd, getConstUpdate, FILE_URL, FILE_DIR } = require('../../constant');
const FileHelpers = require('../../helpers/FileHelpers');

class AuthHandler {
  constructor(service, tokenManager, validator) {
    this._service = service;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.registerUserHandler = this.registerUserHandler.bind(this);
    this.loginUserHandler = this.loginUserHandler.bind(this);
    this.editLoginHandler = this.editLoginHandler.bind(this);
    this.logoutUserHandler = this.logoutUserHandler.bind(this);
  }

  async registerUserHandler(request, reply) {
    this._validator.validateRegisterPayload(request.payload);
    const { avatarUrl, username, email, ...payload } = request.payload;

    await this.verifyUsername(username);
    await this.verifyEmail(email);

    let fileLocation = `${FILE_URL.avatar}/avatar-anonymous.png`;
    if (avatarUrl) {
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

    const userId = await this._service.registerUser({ fileLocation, username, email, ...payload });
    const responseResult = reply.response(successResponse(getConstAdd('User'), { userId }));
    return responseResult.code(201);
  }

  async loginUserHandler(request, reply) {
    this._validator.validateLoginPayload(request.payload);
    const id = await this._service.verifyUserCredential({ ...request.payload });

    const accessToken = this._tokenManager.generateAccessToken({ id });
    const refreshToken = this._tokenManager.generateRefreshToken({ id });

    await this._service.updateRefreshToken(refreshToken, id);

    const tokenData = { accessToken, refreshToken };
    const responseResult = reply.response(successResponse('Success Login', tokenData));
    return responseResult.code(201);
  }

  async editLoginHandler(request, reply) {
    this._validator.validateEditLoginPayload(request.payload);

    const { refreshToken } = request.payload;
    await this._service.verifyRefreshToken(refreshToken);
    const { id } = this._tokenManager.verifyRefreshToken(refreshToken);

    const accessToken = this._tokenManager.generateAccessToken({ id });
    return reply.response(successResponse(getConstUpdate('Authentication User'), { accessToken }));
  }

  async logoutUserHandler(request, reply) {
    const { id } = request.auth.credentials;
    await this._service.updateRefreshToken(null, id);

    return reply.response(successResponse('Success Logout'));
  }
}

module.exports = AuthHandler;
