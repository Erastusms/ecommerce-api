const { successResponse } = require('../../response');
const { getConstAdd, getConstUpdate } = require('../../constant');

class AuthHandler {
  constructor(authService, tokenManager, validator) {
    this._authService = authService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.registerUserHandler = this.registerUserHandler.bind(this);
    this.loginUserHandler = this.loginUserHandler.bind(this);
    this.editLoginHandler = this.editLoginHandler.bind(this);
    this.logoutUserHandler = this.logoutUserHandler.bind(this);
  }

  async registerUserHandler(request, reply) {
    this._validator.validateRegisterPayload(request.payload);

    const userId = await this._authService.registerUser({ ...request.payload });
    const responseResult = reply.response(successResponse({ userId }, getConstAdd('User')));

    return responseResult.code(201);
  }

  async loginUserHandler(request, reply) {
    this._validator.validateLoginPayload(request.payload);
    const id = await this._authService.verifyUserCredential({ ...request.payload });

    const accessToken = this._tokenManager.generateAccessToken({ id });
    const refreshToken = this._tokenManager.generateRefreshToken({ id });

    await this._authService.updateRefreshToken(refreshToken, id);

    const tokenData = { accessToken, refreshToken };
    const responseResult = reply.response(successResponse(tokenData, 'Success Login'));
    return responseResult.code(201);
  }

  async editLoginHandler(request, reply) {
    this._validator.validateEditLoginPayload(request.payload);

    const { refreshToken } = request.payload;
    await this._authService.verifyRefreshToken(refreshToken);
    const { id } = this._tokenManager.verifyRefreshToken(refreshToken);

    const accessToken = this._tokenManager.generateAccessToken({ id });
    return reply.response(successResponse({ accessToken }, getConstUpdate('Authentication User')));
  }

  async logoutUserHandler(request, reply) {
    const { id } = request.auth.credentials;
    await this._authService.updateRefreshToken(null, id);

    return reply.response(successResponse(undefined, 'Success Logout'));
  }
}

module.exports = AuthHandler;
