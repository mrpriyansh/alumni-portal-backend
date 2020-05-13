const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../utils/config');

const handleLogin = async (req, res, db) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ response: 'Fields cannot be empty' });
  } else {
    const exists = await db.collection('users').findOne({ email: email.toLowerCase() });

    if (!exists) res.status(401).json({ response: 'Email does not exist' });
    else {
      const match = await bcrypt.compare(password, exists.hash);

      if (match) {
        const payload = { email: exists.email, name: exists.name };
        const token = jwt.sign(payload, jwtSecret.privKey, {
          algorithm: 'ES512',
          expiresIn: '30d',
        });
        res.status(200).json({ response: 'success', data: token });
      } else {
        res.status(400).json({ response: 'Incorrect password' });
      }
    }
  }
};
module.exports = handleLogin;
