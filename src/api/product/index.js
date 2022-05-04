const ProductHandler = require('./handlerProduct');
const productRoute = require('./routeProduct');

module.exports = {
  name: 'productUser',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const productUserHandler = new ProductHandler(service, validator);
    server.route(productRoute(productUserHandler));
  },
};
