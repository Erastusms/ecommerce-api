exports.up = (pgm) => {
  pgm.createTable('products', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
      notNull: true,
    },
    name: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    rating: {
      type: 'INT',
      notNull: true,
    },
    description: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    image: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    quantity: {
      type: 'INT',
      notNull: true,
    },
    price: {
      type: 'INT',
      notNull: true,
    },
    discount: {
      type: 'INT',
      notNull: true,
    },
    tax: {
      type: 'INT',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(255)',
      notNull: true,
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
  pgm.addConstraint(
    'products',
    'fk_products.user_id_users.id',
    'FOREIGN KEY("user_id") REFERENCES users(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('users');
};
