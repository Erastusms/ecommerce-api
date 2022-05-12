/* eslint-disable no-return-assign */
/* eslint-disable no-mixed-operators */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { isEmpty } = require('lodash');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const { keyObjectSubtitution } = require('../../helpers/ResponseHelpers');

const DBHelpers = require('../../helpers/DBHelpers');

class ProfileService {
  constructor() {
    this._pool = new Pool();
  }

  async addProduct(payload) {
    const { 
      userId, fileLocation, name, description, quantity, price, discount = 0, kategoriId
    } = payload;
    const productId = `item-${nanoid(12)}`;
    const rating = 0;
    const tax = 10 * price / 100;
    const fixPrice = price - discount;
    const query = {
      text: `INSERT INTO products VALUES(${DBHelpers.getValues(11)}) RETURNING id`,
      values: [productId, name, rating, description, fileLocation,
        quantity, fixPrice, discount, tax, userId, kategoriId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) throw new InvariantError('Product gagal ditambahkan');

    return result.rows[0].id;
  }

  async showAllProductsByUserId(userId) {
    const query = {
      text: 'SELECT * FROM products WHERE user_id = $1',
      values: [userId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) throw new NotFoundError('Product');
    const productMaps = result.rows.map((products) => keyObjectSubtitution(products));
    return productMaps;
  }

  async getProductDetail(productId) {
    const query = {
      text: 'SELECT * FROM products WHERE id = $1',
      values: [productId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) throw new NotFoundError('Product');
    return keyObjectSubtitution(result.rows[0]);
  }

  async getProductByCategories(kategoriId) {
    const query = {
      text: 'SELECT * FROM products WHERE kategori_id = $1',
      values: [kategoriId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) throw new NotFoundError('Categories Product');
    return result.rows.map((categories) => keyObjectSubtitution(categories));
  }

  async editProduct(payload) {
    const {
      fileLocation, productId, name, description, quantity, price, discount, kategoriId
    } = payload;
    const tax = 10 * price / 100;
    const fixPrice = price - discount;
    const query = {
      text: `
             UPDATE products SET image = $1, name = $2, description = $3, quantity = $4,
             price = $5, discount = $6, tax = $7, kategori_id = $8, updated_at = now()
             WHERE id = $9 RETURNING id`,
      values: [fileLocation, name, description, quantity,
        fixPrice, discount, tax, kategoriId, productId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) throw new InvariantError('Product gagal diperbarui');

    return result.rows[0].id;
  }

  async updateRatingProduct(commentDetail, productId) {
    let allRating = 0;
    commentDetail.map((comments) => allRating += comments.rating);
    const fixRating = allRating / commentDetail.length;
    const query = {
      text: `UPDATE products SET rating = $1, updated_at = now()
             WHERE id = $2 RETURNING id`,
      values: [fixRating, productId],
    };

    await this._pool.query(query);
    return true;
  }

  async verifyProduct(payload) {
    const { userId, productId } = payload;
    const query = {
      text: 'SELECT * FROM products WHERE user_id = $1 AND id = $2',
      values: [userId, productId],
    };

    const result = await this._pool.query(query);
    if (isEmpty(result.rows)) throw new AuthorizationError('Product');
    return true;
  }

  async deleteProduct(productId) {
    const query = {
      text: 'DELETE FROM products WHERE id = $1',
      values: [productId],
    };

    await this._pool.query(query);
    return true;
  }

  async addComments(payload) {
    const { userId, productId, fileLocation, comment, rating } = payload;
    const commentId = `comment-${nanoid(6)}`;
    const query = {
      text: `INSERT INTO products_comments VALUES(${DBHelpers.getValues(6)}) RETURNING id`,
      values: [commentId, comment, rating, fileLocation, userId, productId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) throw new InvariantError('Product gagal ditambahkan');

    return result.rows[0].id;
  }

  async verifyComment(userId) {
    const query = {
      text: 'SELECT * FROM products_comments WHERE user_id = $1',
      values: [userId],
    };

    const result = await this._pool.query(query);
    if (isEmpty(result.rows)) throw new AuthorizationError('Comment');
    return true;
  }

  async getComment(productId) {
    const query = {
      text: 'SELECT * FROM products_comments WHERE id = $1',
      values: [productId],
    };

    const result = await this._pool.query(query);
    if (isEmpty(result.rows)) throw new NotFoundError('Comment');
    return result.rows[0];
  }

  async getCommentByProductId(commentId) {
    const query = {
      text: `SELECT u.username, u.avatar_url, pc.comment, pc.rating, pc.image
      FROM products_comments AS pc JOIN users AS u ON pc.user_id = u.id 
      WHERE product_id = $1`,
      values: [commentId],
    };

    const result = await this._pool.query(query);
    return result.rows.map((comments) => keyObjectSubtitution(comments));
  }

  async deleteComment(commentId) {
    const query = {
      text: 'DELETE FROM products_comments WHERE id = $1',
      values: [commentId],
    };

    await this._pool.query(query);
    return true;
  }
}

module.exports = ProfileService;
