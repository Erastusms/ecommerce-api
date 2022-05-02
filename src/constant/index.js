module.exports = {
  ACTION: {
    ADD: 'add',
    DELETE: 'delete'
  },
  MIN_YEAR: 1900,
  CURRENT_YEAR: new Date().getFullYear(),
  MAX_LENGTH_STRING: 50,
  GENDER: {
    male: 'Male',
    female: 'Female',
  },
  FILE_URL: {
    avatar: `http://${process.env.HOST}:${process.env.PORT}/assets/profilePicture`,
    productImage: `http://${process.env.HOST}:${process.env.PORT}/assets/productImage`
  },
  FILE_DIR: {
    avatar: '../../assets/profilePicture',
    productImage: '../../assets/productImage',
  },
  arrFileExt: ['image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/webp'],
  getConstAdd: (key) => `${key} berhasil ditambahkan`,
  getConstUpdate: (key) => `${key} berhasil diperbarui`,
  getConstDelete: (key) => `${key} berhasil dihapus`,
};
