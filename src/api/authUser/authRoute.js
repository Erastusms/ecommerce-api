const authRoute = (handler) => [
  {
    method: 'POST',
    path: '/register',
    handler: handler.registerUserHandler,
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
