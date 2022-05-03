const { Pool } = require('pg');
const { isEmpty } = require('lodash');
const InvariantError = require('../../exceptions/InvariantError');
const { keyObjectSubtitution } = require('../../helpers/ResponseHelpers');

class ProfileService {
  constructor() {
    this._pool = new Pool();
  }

  async showDetail(userId) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [userId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) throw new InvariantError('Profile gagal ditampilkan');
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

  async addFileUpload(id, fileLocation) {
    const query = {
      text: 'UPDATE users SET avatar_url = $1, updated_at = now() WHERE id = $2 RETURNING id',
      values: [fileLocation, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) throw new InvariantError('Avatar gagal diupload');
    return result.rows[0].id;
  }
}

module.exports = ProfileService;
