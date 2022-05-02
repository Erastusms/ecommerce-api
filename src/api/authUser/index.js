const AuthHandler = require('./handlerAuth');
const authRoute = require('./routeAuth');

module.exports = {
  name: 'authentications',
  version: '1.0.0',
  register: async (server, { service, tokenManager, validator }) => {
    const authUserHandler = new AuthHandler(service, tokenManager, validator);
    server.route(authRoute(authUserHandler));
  },
};
