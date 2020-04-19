const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../utils/config');

module.exports = async (req, res, next) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, jwtSecret.pubKey, { algorithm: 'ES512' });
    req.user = decoded;

    next();
  } catch (err) {
    throw err;
  }
};
