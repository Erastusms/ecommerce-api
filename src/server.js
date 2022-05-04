require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');

const { finalResponse } = require('./response');

const authUser = require('./api/authUser');
const AuthService = require('./services/db/AuthService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/AuthUser');

const profileUser = require('./api/profileUser');
const ProfileService = require('./services/db/ProfileService');
const ProfileValidator = require('./validator/ProfileUser');

const product = require('./api/product');
const ProductService = require('./services/db/ProductService');
const ProductValidator = require('./validator/Product');

const init = async () => {
  const authService = new AuthService();
  const profileService = new ProfileService();
  const productService = new ProductService();
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  server.auth.strategy(process.env.STRATEGY_NAME, 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
        token: artifacts.token
      },
    }),
  });

  await server.register([
    {
      plugin: authUser,
      options: {
        service: authService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: profileUser,
      options: {
        service: profileService,
        authService,
        validator: ProfileValidator,
      },
    },
    {
      plugin: product,
      options: {
        service: productService,
        validator: ProductValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, reply) => {
    const { response } = request;
    return reply.response(finalResponse(response, reply));
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
