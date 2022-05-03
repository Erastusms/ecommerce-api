const ProfileHandler = require('./handlerProfile');
const profileRoute = require('./routeProfile');

module.exports = {
  name: 'profileUser',
  version: '1.0.0',
  register: async (server, { service, authService, validator }) => {
    const profileUserHandler = new ProfileHandler(service, authService, validator);
    server.route(profileRoute(profileUserHandler));
  },
};
