const fs = require('fs');
const path = require('path');

const writeToFile = error => {
  try {
    const filePath = path.join(__dirname, '../../logs/errors.log');

    fs.appendFileSync(
      filePath,
      `\n\n ${new Date().toDateString()} ${new Date().toTimeString()} \n\t${error}`
    );
  } catch (err) {
    console.log('Failed To Write File', err);
  }
};

module.exports = writeToFile;
