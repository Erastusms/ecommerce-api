const fs = require('fs');
const path = require('path');
const { successResponse } = require('../../response');
const { getConstAdd, getConstUpdate, getConstDelete, FILE_URL, FILE_DIR } = require('../../constant');
const FileHelpers = require('../../helpers/FileHelpers');

class HandlerProduct {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.addProductHandler = this.addProductHandler.bind(this);
    this.getAllProductHandler = this.getAllProductHandler.bind(this);
    this.detailProductHandler = this.detailProductHandler.bind(this);
    this.editProductHandler = this.editProductHandler.bind(this);
    this.deleteProductHandler = this.deleteProductHandler.bind(this);
  }

  async addProductHandler(request, reply) {
    this._validator.validateProductPayload(request.payload);
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
    const { userId } = request.params;
    const data = await this._service.showAllProductsByUserId(userId);
    return reply.response(successResponse('Show Detail Product', data));
  }

  async detailProductHandler(request, reply) {
    const { productId } = request.params;
    const data = await this._service.getProduct(productId);
    return reply.response(successResponse('Show Detail Product', data));
  }

  async editProductHandler(request, reply) {
    this._validator.validateProductPayload(request.payload);
    const { id: userId } = request.auth.credentials;
    const { image } = request.payload;
    const { productId } = request.params;
    await this._service.verifyProduct({ userId, productId });
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

    await this._service.editProduct({ userId, fileLocation, productId, ...request.payload });
    return reply.response(successResponse(getConstUpdate('Product')));
  }

  async deleteProductHandler(request, reply) {
    const { productId } = request.params;
    const { id: userId } = request.auth.credentials;
    await this._service.verifyProduct({ userId, productId });

    const imageProduct = await this._service.getProduct(productId);
    const imageName = imageProduct.image.split('/')[6];
    
    await fs.promises.unlink(path.join(`assets/productImage/${userId}/${imageName}`));
    await this._service.deleteProduct(productId);
    
    return reply.response(successResponse(getConstDelete('Product')));
  }
}

module.exports = HandlerProduct;
