exports.up = (pgm) => {
  pgm.createTable('categories', {
    id: {
      type: 'serial',
      primaryKey: true,
      notNull: true,
    },
    name: {
      type: 'VARCHAR(255)',
      notNull: true,
    }
  });

  pgm.sql("INSERT INTO categories(name) VALUES ('Buku')");
  pgm.sql("INSERT INTO categories(name) VALUES ('Dapur')");
  pgm.sql("INSERT INTO categories(name) VALUES ('Elektronik')");
  pgm.sql("INSERT INTO categories(name) VALUES ('Fashion Pria')");
  pgm.sql("INSERT INTO categories(name) VALUES ('Fashion Wanita')");
  pgm.sql("INSERT INTO categories(name) VALUES ('Gaming')");
  pgm.sql("INSERT INTO categories(name) VALUES ('Handphone dan tablet')");
  pgm.sql("INSERT INTO categories(name) VALUES ('Olahraga')");
  pgm.sql("INSERT INTO categories(name) VALUES ('Otomotif')");
  pgm.sql("INSERT INTO categories(name) VALUES ('Film')");
};
  
exports.down = (pgm) => {
  pgm.dropTable('categories');
};
