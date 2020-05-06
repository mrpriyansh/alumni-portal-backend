const bcrypt = require('bcrypt');
const sendMail = require('./sendMail');

const handleSignup = async (req, res, db,client) => {
  // eslint-disable-next-line prettier/prettier
  const { name, email, phoneno, password, confirmPassword, batchName, subBatch, admissionYear, graduationYear, dob, userType, designation, company, instituteEmail, gender } = req.body;
  const errors = [];
  // eslint-disable-next-line prettier/prettier
  if (!name || !email || !password || !phoneno || !batchName || !subBatch || !admissionYear || !graduationYear || !dob || !userType || !designation || !company || !gender)
    errors.push('Fields can not be empty');
  const exists = await db.collection('users').findOne({ email });
  if (userType === 'student') {
    const instituteEmailexists = await db.collection('users').findOne({ instituteEmail });
    if (instituteEmailexists) errors.push('Institute Email Already exists!');
  }
  if (exists) errors.push('Email already Exists');
  if (password !== confirmPassword) errors.push("Pasword don't match!");
  if (password.length < 6) errors.push('Password should be at least 6 chars long.');
  if (errors.length) res.status(400).json({ icon: 'error', title: errors[0] });
  else {
    try {
      const hash = await bcrypt.hash(password, 10);
      await db.collection('users').insertOne({
        name,
        email,
        phoneno,
        hash,
        batchName,
        subBatch,
        admissionYear,
        graduationYear,
        dob,
        userType,
        designation,
        company,
        instituteEmail,
        gender,
        isAdmin: false,
        isAdminVerified: false,
        isEmailVerified: false,
        timestamp: Date(),
      });

      sendMail(req, res, db, '');
      if (userType === 'student') sendMail(req, res, db, 'institute');
      // eslint-disable-next-line prettier/prettier
        res.status(200).json({ icon: 'success', title: 'Registered Successfully', text: 'Verify your email!' });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(`The transaction was aborted due to an unexpected error: ${err}`);
      res.status(500).json({ icon: 'error', title: 'Server Error! Please try again!' });
    }

  }
};

module.exports = { handleSignup };
