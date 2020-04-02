const fs = require('fs');
require('dotenv').config();

const Cloud = require('@google-cloud/storage');
const path = require('path');
// const conf=require()
const gcsserviceKey = path.join(__dirname, '../../keys/gcskeys.json');
const privateKey = fs.readFileSync('keys/ecd.pem');
const publicKey = fs.readFileSync('keys/ecd.pub.pem');

const { PORT, DB_HOST, DB_NAME } = process.env;

const { Storage } = Cloud;

const config = {
  port: PORT,
  host: DB_HOST,
  dbName: DB_NAME,
  jwtSecret: {
    privKey: privateKey,
    pubKey: publicKey,
  },
  gcsConfig: new Storage({
    keyFilename: gcsserviceKey,
    projectid: 'tutorial-262713',
  }),
  // gcsConfig:
};

module.exports = config;
