/* eslint-disable no-mixed-operators */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { isEmpty } = require('lodash');
const InvariantError = require('../../exceptions/InvariantError');
const { keyObjectSubtitution } = require('../../helpers/ResponseHelpers');

const DBHelpers = require('../../helpers/DBHelpers');

class ProfileService {
  constructor() {
    this._pool = new Pool();
  }

  async addProduct(payload) {
    const { userId, fileLocation, name, description, quantity, price, discount = 0 } = payload;
    const productId = `item-${nanoid(12)}`;
    const rating = 0;
    const tax = 10 * price / 100;
    const fixPrice = price - discount;
    const query = {
      text: `INSERT INTO products VALUES(${DBHelpers.getValues(10)}) RETURNING id`,
      values: [productId, name, rating, description, fileLocation,
        quantity, fixPrice, discount, tax, userId],
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
    if (!result.rows.length) throw new InvariantError('Product gagal ditampilkan');
    const productMaps = result.rows.map((products) => keyObjectSubtitution(products));
    return productMaps;
  }

  async showDetail(productId) {
    const query = {
      text: 'SELECT * FROM products WHERE id = $1',
      values: [productId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) throw new InvariantError('Product gagal ditampilkan');
    return keyObjectSubtitution(result.rows[0]);
  }

  async editProfile(payload) {
    const { id, email, fullname, phoneNumber,
      address, postalCode, country, birthdate, gender
    } = payload;

    const query = {
      text: `
              UPDATE users SET email = $1, fullname = $2, phone_number = $3, address = $4,
              postal_code = $5, country = $6, birthdate = $7, gender = $8, updated_at = now()
              WHERE id = $9 RETURNING id
            `,
      values: [email, fullname, phoneNumber, address,
        postalCode, country, birthdate, gender, id],
    };

    const result = await this._pool.query(query);
    if (isEmpty(result.rows)) throw new InvariantError('User gagal diupdate');

    return true;
  }

  async getOldAvatar(userId) {
    const queryParams = {
      text: 'SELECT avatar_url FROM users WHERE id = $1',
      values: [userId],
    };

    const result = await this._pool.query(queryParams);
    if (isEmpty(result.rows)) return false;
    return result.rows[0].avatar_url;
  }
}

module.exports = ProfileService;
