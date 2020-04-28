const bcrypt = require('bcrypt');
const sendMail=require('./sendMail');

const handleSignup = async (req, res, db) => {
  // eslint-disable-next-line prettier/prettier
  const { name, email, phoneno, password, confirmPassword, batchName, subBatch, admissionYear, graduationYear, dob, userType, designation, company, instituteEmail, gender } = req.body;
  const errors = [];
  // eslint-disable-next-line prettier/prettier
  if (!name || !email || !password || !phoneno || !batchName || !subBatch || !admissionYear || !graduationYear || !dob || !userType || !designation || !company || !gender)
    errors.push('Fields can not be empty');
  const exists = await db.collection('users').findOne({ email });
  if (exists) errors.push('Email already exists');
  if (password !== confirmPassword) errors.push("Pasword don't match!");
  if (password.length < 6) errors.push('Password should be at least 6 chars long.');
  if (errors.length) res.status(400).json({ icon: 'error', title: errors[0] });
  else {
    const hash = await bcrypt.hash(password, 10);
    await db
      .collection('users')
      // eslint-disable-next-line prettier/prettier
      .insertOne({ name, email, phoneno, hash, batchName, subBatch, admissionYear, graduationYear, dob, userType, designation, company, instituteEmail, gender, isAdmin:false,  isAdminVerified: false, isEmailVerified: false, timestamp: new Date() });
    const { isAdminVerified } = await db.collection('users').findOne({ email });
    const user = await db.collection('users').findOne({ email });
    const userID = user._id;
    if (!isAdminVerified) {
      //if it is not verified by admin then admin verification is done by sending email to instituteID
      if(userType.toLowerCase()==="student")
      {
        sendMail(req,res,db,'institute');
      }
      // if it is not a admin verified then verify a user by admin
      else{
      await db.collection('admins').updateOne({}, { $push: { usersToVerify: userID } });
      }
    }
    // eslint-disable-next-line prettier/prettier
    res.status(200).json({ icon: 'success', title: 'Registered Successfully', text: 'Verify your email!' });
   
    sendMail(req,res,db,'');
   
  }
};

module.exports = { handleSignup };
