const routeProduct = (handler) => [
  {
    method: 'POST',
    path: '/product',
    handler: handler.addProductHandler,
    options: {
      auth: process.env.STRATEGY_NAME,
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 512000,
      },
    },
  },
  {
    method: 'GET',
    path: '/product',
    handler: handler.getAllProductHandler,
    options: {
      auth: process.env.STRATEGY_NAME,
    },
  },
  {
    method: 'GET',
    path: '/product/{productId}',
    handler: handler.detailProductHandler
  },
];
  
module.exports = routeProduct;
