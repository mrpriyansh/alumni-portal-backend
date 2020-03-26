const bcrypt = require('bcrypt');

const handleSignup = async (req, res, db) => {
  const { name, email, phone, password, password2 } = req.body;
  const errors = [];
  if (!name || !email || !password || !password2 || !phone) errors.push('Fields can not be empty');
  const exists = await db.collection('users').findOne({ email });
  if (exists) errors.push('Email already exists');
  if (password.length < 6) errors.push('Password should be at least 6 chars long');
  if (password !== password2) errors.push('passwords do not match');
  if (errors.length) res.status(400).send(errors);
  else {
    const hash = await bcrypt.hash(password, 10);
    await db
      .collection('users')
      .insertOne({ name, email, phone, hash, isAdmin: false, isVerified: false });
    const { isVerified } = await db.collection('users').findOne({ email });
    const user = await db.collection('users').findOne({ email });
    const userID = user._id;
    if (!isVerified) {
      // if it is not a admin then verify a user by admin
      await db.collection('admins').updateOne({}, { $push: { usersToVerify: userID } });
    }
    res.status(200).send('success');
  }
};

module.exports = { handleSignup };
