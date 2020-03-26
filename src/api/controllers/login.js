const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../utils/config');

const handleLogin = async (req, res, db) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send('Fields cannot be empty');
  } else {
    const exists = await db.collection('users').findOne({ email });

    if (!exists) res.status(401).send('Email does not exist');
    else {
      const match = await bcrypt.compare(password, exists.hash);

      if (match) {
        const payload = { email: exists.email, name: exists.name };
        const token = jwt.sign(payload, jwtSecret.privKey, {
          algorithm: 'ES512',
          expiresIn: '30d',
        });
        res.status(200).send(token);
      } else {
        res.status(400).send('Incorrect password');
      }
    }
  }
};
module.exports = handleLogin;
