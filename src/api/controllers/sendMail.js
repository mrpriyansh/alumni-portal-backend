const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

module.exports= async (req,res,db,emailType) =>{


  const {email,instituteEmail}=req.body;
   
  const user= await db.collection('users').findOne({ email });
    const transport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.SERVER_MAIL_ADDRESS,
          pass: process.env.SERVER_PASSWORD,
        },
      });
      const info = {
        username: user.name,
        id: user._id,
        expiry: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      };
      const token = jwt.sign(info, process.env.TOKEN_ACCESS_SECRET, { expiresIn: '1h' });
     
      await transport.sendMail({
        from: 'noreply <process.env.SERVER_MAIL_ADDRESS>',
        to: (emailType=="institute")? (instituteEmail):(email),
        subject: `${emailType} Email verification`,
        text: `Visit this http://localhost:4000/verify${emailType}Email/${token}`,
        html: `<a href="http://localhost:4000/api/verify${emailType}Email/${token}"><H2>Click on this link to verify your ${emailType} email!!</H2></a>`,
      });

};
