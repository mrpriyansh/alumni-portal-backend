const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../utils/config');
const { ErrorHandler } = require('../../utils/handleError');

const handleLogin = async (req, res, db, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ response: 'Fields cannot be empty' });
  } else {
    try {
      const exists = await db.collection('users').findOne({ email: email.toLowerCase() });
      if (!exists) throw new ErrorHandler(401, 'Email does not Exists');
      else {
        const match = await bcrypt.compare(password, exists.hash);

        if (match) {
          const payload = { email: exists.email, name: exists.name };
          const token = jwt.sign(payload, jwtSecret.privKey, {
            algorithm: 'ES512',
            expiresIn: '30d',
          });
          res.status(200).json(token);
        } else {
          throw new ErrorHandler(401, 'Incorrect Password');
        }
      }
    } catch (err) {
      next(err);
    }
  }
};
module.exports = handleLogin;
