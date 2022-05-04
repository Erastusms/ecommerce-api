const fs = require('fs');
const path = require('path');
const { arrFileExt } = require('../constant');
const InvariantError = require('../exceptions/InvariantError');

module.exports = {
  verifyFileExt(file) {
    if (!file.hapi) throw new InvariantError('Payload must be a file');
    if (file.hapi.filename === '') throw new InvariantError('File cant be empty');

    const contentType = Object.values(file.hapi.headers)[1];
    const isContentTypeValid = arrFileExt.some((validExt) => validExt === contentType);

    if (!isContentTypeValid) throw new InvariantError('Invalid file extension uploaded');
    return file;
  },

  writeFile(payloadFile) {
    const { userId, file, meta, folderDir, fileType } = payloadFile;
    const filename = `${fileType}-${new Date().getTime()}-${meta.filename}`;
    const folderUpload = path.resolve(__dirname, folderDir);
    let pathUploaded = `${folderUpload}/${filename}`;

    if (userId) {
      const newDir = `${folderUpload}/${userId}`;
      if (!fs.existsSync(newDir)) {
        fs.mkdirSync(newDir, { recursive: true });
      }
      pathUploaded = `${newDir}/${filename}`;
    }

    const fileStream = fs.createWriteStream(pathUploaded);

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));
      file.pipe(fileStream);
      file.on('end', () => resolve(filename));
    });
  }
};
