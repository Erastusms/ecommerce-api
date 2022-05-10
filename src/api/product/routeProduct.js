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
    path: '/product/toko/{userId}',
    handler: handler.getAllProductHandler
  },
  {
    method: 'GET',
    path: '/product/detail/{productId}',
    handler: handler.detailProductHandler
  },
  {
    method: 'PUT',
    path: '/product/{productId}',
    handler: handler.editProductHandler,
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
    method: 'DELETE',
    path: '/product/{productId}',
    handler: handler.deleteProductHandler,
    options: {
      auth: process.env.STRATEGY_NAME
    },
  },
];

module.exports = routeProduct;
