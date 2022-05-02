const authRoute = (handler) => [
  {
    method: 'POST',
    path: '/register',
    handler: handler.registerUserHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 512000,
      },
    },
  },
  {
    method: 'POST',
    path: '/login',
    handler: handler.loginUserHandler,
  },
  {
    method: 'POST',
    path: '/logout',
    handler: handler.logoutUserHandler,
    options: {
      auth: process.env.STRATEGY_NAME,
    },
  }
];

module.exports = authRoute;
