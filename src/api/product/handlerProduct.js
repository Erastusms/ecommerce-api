const { successResponse } = require('../../response');
const { getConstAdd, FILE_URL, FILE_DIR } = require('../../constant');
const FileHelpers = require('../../helpers/FileHelpers');

class HandlerProduct {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.addProductHandler = this.addProductHandler.bind(this);
    this.getAllProductHandler = this.getAllProductHandler.bind(this);
    this.detailProductHandler = this.detailProductHandler.bind(this);
  }

  async addProductHandler(request, reply) {
    this._validator.validateAddProductPayload(request.payload);
    const { id: userId } = request.auth.credentials;
    const { image } = request.payload;
    await FileHelpers.verifyFileExt(image);

    const payloadFile = {
      userId,
      file: image,
      meta: image.hapi,
      folderDir: FILE_DIR.productImage,
      fileType: 'product'
    };
    const filename = await FileHelpers.writeFile(payloadFile);
    const fileLocation = `${FILE_URL.productImage}/${userId}/${filename}`;

    await this._service.addProduct({ userId, fileLocation, ...request.payload });
    return reply.response(successResponse(getConstAdd('Product')));
  }

  async getAllProductHandler(request, reply) {
    const { id } = request.auth.credentials;
    const data = await this._service.showAllProductsByUserId(id);
    return reply.response(successResponse('Show Detail Product', data));
  }

  async detailProductHandler(request, reply) {
    const { productId } = request.params;
    const data = await this._service.showDetail(productId);
    return reply.response(successResponse('Show Detail Product', data));
  }
}

module.exports = HandlerProduct;
