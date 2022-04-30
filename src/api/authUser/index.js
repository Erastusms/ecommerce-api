const AuthHandler = require('./authHandler');
const authRoute = require('./authRoute');

module.exports = {
  name: 'authentications',
  version: '1.0.0',
  register: async (server, { authService, tokenManager, validator }) => {
    const authUserHandler = new AuthHandler(authService, tokenManager, validator);
    server.route(authRoute(authUserHandler));
  },
};
