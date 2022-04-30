const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const { isEmpty } = require('lodash');
const bcrypt = require('bcrypt');

const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

class AuthService {
  constructor() {
    this._pool = new Pool();
  }

  async registerUser(payload) {
    const { username, password, fullname } = payload;
    await this.verifyUsername(username);

    const id = `user-${nanoid(12)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) throw new InvariantError('User gagal ditambahkan');

    return result.rows[0].id;
  }

  async verifyUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rows.length > 0) { 
      throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.'); 
    }
  }

  async verifyUserCredential(payload) {
    const { username, password } = payload;
    const query = {
      text: 'SELECT * FROM users WHERE username = $1',
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
      text: 'UPDATE users SET token = $1, updated_at = now() WHERE id = $2',
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

  async getUserById(userId) {
    const query = {
      text: 'SELECT id, username, fullname FROM users WHERE id = $1',
      values: [userId],
    };

    const result = await this._pool.query(query);
    if (isEmpty(result.rows)) throw new NotFoundError('User');

    return result.rows[0];
  }
}

module.exports = AuthService;
