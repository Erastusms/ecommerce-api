exports.up = (pgm) => {
  pgm.createTable('products_comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
      notNull: true,
    },
    comment: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    rating: {
      type: 'INT',
      notNull: true,
    },
    image: {
      type: 'VARCHAR(255)',
      default: null
    },
    user_id: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    product_id: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    created_at: {
      type: 'timestamp',
      default: pgm.func('current_timestamp'),
    }
  });
  pgm.addConstraint(
    'products_comments',
    'fk_products_comments.user_id_users.id',
    'FOREIGN KEY("user_id") REFERENCES users(id) ON DELETE CASCADE',
  );
  pgm.addConstraint(
    'products_comments',
    'fk_products_comments.product_id_products.id',
    'FOREIGN KEY("product_id") REFERENCES products(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('products_comments');
};
