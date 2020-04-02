const { gcsConfig } = require('../../utils/config');

const bucket = gcsConfig.bucket('alumni-portal'); // should be your bucket name

module.exports = (file, fileName) =>
  new Promise((resolve, reject) => {
    const { buffer } = file;
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });
    // eslint-disable-next-line prettier/prettier
    blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        resolve(publicUrl);
      })
      .on('error', () => {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject(`Unable to upload image, something went wrong`);
      })
      .end(buffer);
  });
