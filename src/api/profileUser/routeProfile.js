const routeProfile = (handler) => [
  {
    method: 'GET',
    path: '/profile',
    handler: handler.detailProfileHandler,
    options: {
      auth: process.env.STRATEGY_NAME,
    },
  },
  {
    method: 'PUT',
    path: '/profile',
    handler: handler.editProfileHandler,
    options: {
      auth: process.env.STRATEGY_NAME,
    },
  },
  {
    method: 'PUT',
    path: '/avatar',
    handler: handler.changeAvatarHandler,
    options: {
      auth: process.env.STRATEGY_NAME,
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 512000,
      },
    },
  }
];

module.exports = routeProfile;
