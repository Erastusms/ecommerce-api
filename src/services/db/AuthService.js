const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const { isEmpty } = require('lodash');
const bcrypt = require('bcrypt');

const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

const DBHelpers = require('../../helpers/DBHelpers');

class AuthService {
  constructor() {
    this._pool = new Pool();
  }

  async registerUser(payload) {
    const { fileLocation, username, email, password, fullname,
      phoneNumber, address, postalCode, country, birthdate, gender
    } = payload;
    
    const userId = `user-${nanoid(12)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = {
      text: `INSERT INTO users VALUES(${DBHelpers.getValues(13)}) RETURNING id`,
      values: [userId, username, email, hashedPassword, fullname, phoneNumber,
        address, postalCode, country, 0, birthdate, gender, fileLocation],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) throw new InvariantError('User gagal ditambahkan');

    return result.rows[0].id;
  }

  async verifyUsername(username) {
    const query = {
      text: 'SELECT * FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);
    if (result.rows.length > 0) {
      throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.');
    }
  }

  async verifyEmail(email) {
    const query = {
      text: 'SELECT * FROM users WHERE email = $1',
      values: [email],
    };

    const result = await this._pool.query(query);
    if (result.rows.length > 0) {
      throw new InvariantError('Gagal menambahkan user. Email sudah digunakan.');
    }
  }

  async verifyUserCredential(payload) {
    const { username, password } = payload;
    const query = {
      text: 'SELECT * FROM users WHERE username = $1 OR email = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (isEmpty(result.rows)) throw new NotFoundError('User');

    const { id, password: hashedPassword } = result.rows[0];
    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) throw new AuthenticationError();
    return id;
  }

  async updateRefreshToken(token, userId) {
    const query = {
      text: 'UPDATE users SET token = $1, last_login = now(), updated_at = now() WHERE id = $2',
      values: [token, userId],
    };

    await this._pool.query(query);
  }

  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await this._pool.query(query);
    if (isEmpty(result.rows)) throw new InvariantError('Refresh token tidak valid');
  }

  // async getUserById(userId) {
  //   const query = {
  //     text: 'SELECT id, username, fullname FROM users WHERE id = $1',
  //     values: [userId],
  //   };

  //   const result = await this._pool.query(query);
  //   if (isEmpty(result.rows)) throw new NotFoundError('User');

  //   return result.rows[0];
  // }
}

module.exports = AuthService;
