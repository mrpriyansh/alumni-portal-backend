const fs = require('fs');
require('dotenv').config();

const Cloud = require('@google-cloud/storage');
const path = require('path');
// const conf=require()
const gcsserviceKey = path.join(__dirname, '../../keys/gcskeys.json');
const privateKey = fs.readFileSync('keys/ecd.pem');
const publicKey = fs.readFileSync('keys/ecd.pub.pem');

const {
  PORT,
  DB_HOST,
  DB_NAME,
  linkedinClientId,
  linkedinSecretKey,
  SENDGRID_API_KEY,
} = process.env;

const { Storage } = Cloud;

const apiUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://linkedin-oauth-api-dot-tutorial-262713.el.r.appspot.com'
    : 'http://localhost:4000';

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
  apiUrl,
  linkedinClientId,
  linkedinSecretKey,
  SENDGRID_API_KEY,
};

module.exports = config;
