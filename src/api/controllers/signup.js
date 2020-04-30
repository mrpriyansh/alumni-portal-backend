const bcrypt = require('bcrypt');
const sendMail=require('./sendMail');

const handleSignup = async (req, res, db,client) => {
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
    const session=client.startSession();

    const transactionOptions= {
      readPreference: 'primary',
      readConcern: { level: 'local' },
      writeConcern: { w: 'majority' }
  };

  try{
    const hash = await bcrypt.hash(password, 10);
    const adminsCollection=await  db.collection('admins');
    const usersCollection=await db.collection('users');
    const transactionResults=await session.withTransaction(async()=>{
     await usersCollection
      // eslint-disable-next-line prettier/prettier

      .insertOne({ name, email, phoneno, hash, batchName, subBatch, admissionYear, graduationYear, dob, userType, isAdmin:false,  isAdminVerified: false, isEmailVerified: false },{session});
    const { isAdminVerified } = await usersCollection.findOne({ email },{session});
    const user = await usersCollection.findOne({ email },{session});
    const userID = user._id;
    if (!isAdminVerified) {
      // if it is not a admin varified then verify a user by admin
      await adminsCollection.updateOne({}, { $push: { usersToVerify: userID } },{session});

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
    },transactionOptions);

    if(transactionResults)
    {
      // eslint-disable-next-line prettier/prettier
    res.status(200).json({ icon: 'success', title: 'Registered Successfully', text: 'Verify your email!' });

    
    }
    else{
      console.log("The transaction was intentionally aborted.");
    }

  } catch(err){
    console.log("The transaction was aborted due to an unexpected error: " + err);
  }finally {
    await session.endSession();
  }
  const userDetails = await db.collection('users').findOne({ email });
    const transport = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.SERVER_MAIL_ADDRESS,
        pass: process.env.SERVER_PASSWORD,
      },
    });
    const info = {
      username: userDetails.name,
      id: userDetails._id,
      expiry: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    };
    const token = jwt.sign(info, process.env.TOKEN_ACCESS_SECRET, { expiresIn: '1h' });
    // console.log(token);
    // console.log(mailOptions);
    await transport.sendMail({
      from: 'noreply <process.env.SERVER_MAIL_ADDRESS>',
      to: userDetails.email,
      subject: 'Email verification',
      text: `Visit this http://localhost:4000/verifyEmail/${token}`,
      html: `<a href="http://localhost:4000/api/verifyEmail/${token}"><H2>Click on this link to verify your email!!</H2></a>`,
    });

   
    sendMail(req,res,db,'');
   
  }
};

module.exports = { handleSignup };
