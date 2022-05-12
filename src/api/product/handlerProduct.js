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
    this.getProductByCategoriesHandler = this.getProductByCategoriesHandler.bind(this);

    this.addCommentProductHandler = this.addCommentProductHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
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

    const productId = await this._service.addProduct({ userId, fileLocation, ...request.payload });
    return reply.response(successResponse(getConstAdd('Product', { productId })));
  }

  async getAllProductHandler(request, reply) {
    const { userId } = request.params;
    const data = await this._service.showAllProductsByUserId(userId);
    return reply.response(successResponse('Show Detail Product', data));
  }

  async getProductByCategoriesHandler(request, reply) {
    const { kategoriId } = request.params;
    const data = await this._service.getProductByCategories(kategoriId);
    return reply.response(successResponse('Show Product By Categories', data));
  }

  async detailProductHandler(request, reply) {
    const { productId } = request.params;
    const data = await this._service.getProductDetail(productId);
    const comments = await this._service.getCommentByProductId(productId);
    const response = {
      ...data,
      comments
    };
    return reply.response(successResponse('Show Detail Product', response));
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

  async addCommentProductHandler(request, reply) {
    this._validator.validateCommentsPayload(request.payload);
    const { id: userId } = request.auth.credentials;
    const { productId } = request.params;
    const { image } = request.payload;
    let fileLocation = null;
    if (image) {
      await FileHelpers.verifyFileExt(image);

      const payloadFile = {
        userId: productId,
        file: image,
        meta: image.hapi,
        folderDir: FILE_DIR.productComments,
        fileType: 'productComments'
      };
      const filename = await FileHelpers.writeFile(payloadFile);
      fileLocation = `${FILE_URL.productComments}/${productId}/${filename}`;
    }

    const payloadComments = {
      userId, productId, fileLocation, ...request.payload
    };

    const commentId = await this._service.addComments(payloadComments);
    // const commentId = '4';
    const productDetail = await this._service.getCommentByProductId(productId);
    // const commentLength = productDetail.comment.length;
    await this._service.updateRatingProduct(productDetail, productId);
    await this._service.updateRatingProduct(productDetail);
    return reply.response(successResponse(getConstAdd('Comment'), { commentId }));
  }

  async deleteCommentHandler(request, reply) {
    const { commentId } = request.params;
    const { id: userId } = request.auth.credentials;
    await this._service.verifyComment(userId);

    const dataComment = await this._service.getComment(commentId);
    if (dataComment.image !== null) {
      const imageName = dataComment.image.split('/')[6];
      const productId = dataComment.product_id;
      await fs.promises.unlink(path.join(`assets/productComments/${productId}/${imageName}`));
    }
    await this._service.deleteComment(commentId);

    return reply.response(successResponse(getConstDelete('Product')));
  }
}

module.exports = HandlerProduct;
