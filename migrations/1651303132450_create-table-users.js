exports.up = (pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    username: {
      type: 'VARCHAR(50)',
      unique: true,
      notNull: true,
    },
    email: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    password: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    fullname: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    phone_number: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    address: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    postal_code: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    country: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    saldo: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    birthdate: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    gender: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    avatar_url: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    token: {
      type: 'VARCHAR(255)',
    },
    last_login: {
      type: 'timestamp',
    },
    created_at: {
      type: 'timestamp',
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      default: pgm.func('current_timestamp'),
    },
  });
};
  
exports.down = (pgm) => {
  pgm.dropTable('users');
};
