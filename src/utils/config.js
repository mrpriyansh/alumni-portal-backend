const fs = require('fs');
require('dotenv').config();

const privateKey = fs.readFileSync('keys/ecd.pem');
const publicKey = fs.readFileSync('keys/ecd.pub.pem');

const { PORT, DB_HOST, DB_NAME } = process.env;

const config = {
  port: PORT,
  host: DB_HOST,
  dbName: DB_NAME,
  jwtSecret: {
    privKey: privateKey,
    pubKey: publicKey,
  },
};

module.exports = config;
