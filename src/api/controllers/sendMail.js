const sgMail = require('@sendgrid/mail');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, db, emailType) => {
  const { email, instituteEmail } = req.body;
  const user = await db.collection('users').findOne({ email });
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const info = {
    username: user.name,
    id: user._id,
    expiry: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
  };
  const token = jwt.sign(info, process.env.TOKEN_ACCESS_SECRET, { expiresIn: '1h' });

  const mail = {
    to: emailType === 'institute' ? instituteEmail : email,
    from: 'Alumni Portal <mr.priyanshgaharana@gmail.com>',
    subject: `${emailType} Email verification`,
    text: `Visit this http://localhost:4000/api/verify${emailType}Email/${token}`,
    html: `<a href="http://localhost:4000/api/verify${emailType}Email/${token}"><H2>Click on this link to verify your ${emailType} email!!</H2></a>`,
  };
  sgMail.send(mail, err => {
    if (err) console.log(err);
    // else console.log('Message sent successfully', det);
  });
};
