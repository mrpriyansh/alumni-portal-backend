const { ErrorHandler } = require('../../utils/handleError');

module.exports = db => {
  return async (req, res, next) => {
    try {
      const { email } = req.body;
      if (email === null) throw new ErrorHandler(417, `'email' Is Required In Request Body'`);
      const authCheck = await db.collection('users').findOne({ email: email.toLowerCase() });
      if (authCheck === null) {
        throw new ErrorHandler(401, 'You Are Not Registered', false);
      } else if (authCheck.isEmailVerified) {
        next();
      } else {
        throw new ErrorHandler(403, 'Please Verify Your Email Id!');
      }
    } catch (err) {
      next(err);
    }
  };
};
