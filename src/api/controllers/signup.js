const bcrypt = require('bcrypt');

const handleSignup = async (req, res, db) => {
  // eslint-disable-next-line prettier/prettier
  const { name, email, phoneno, password, batchName, subBatch, graduationYear, dob, userType} = req.body;
  const errors = [];
  // eslint-disable-next-line prettier/prettier
  if (!name || !email || !password || !phoneno || !batchName || !subBatch || !graduationYear || !dob || !userType)
    errors.push('Fields can not be empty');
  const exists = await db.collection('users').findOne({ email });
  if (exists) errors.push('Email already exists');
  if (password.length < 6) errors.push('Password should be at least 6 chars long');
  if (errors.length) res.status(400).json({ icon: 'error', title: errors[0] });
  else {
    const hash = await bcrypt.hash(password, 10);
    await db
      .collection('users')
      // eslint-disable-next-line prettier/prettier
      .insertOne({ name, email, phoneno, hash, batchName, subBatch, graduationYear, dob, userType, isAdmin:'false',  isAdminVerified: false, isEmailVerified: false });
    const { isAdminVerified } = await db.collection('users').findOne({ email });
    const user = await db.collection('users').findOne({ email });
    const userID = user._id;
    if (!isAdminVerified) {
      // if it is not a admin varified then verify a user by admin
      await db.collection('admins').updateOne({}, { $push: { usersToVerify: userID } });
    }
    // eslint-disable-next-line prettier/prettier
    res.status(200).json({ icon: 'success', title: 'Registered Successfully', text: 'Verify your email!' });
  }
};

module.exports = { handleSignup };
