const { ErrorHandler } = require('../../utils/handleError');

module.exports = db => {
  return async (req, res, next) => {
    try {
      const { email } = req.body;
      const authCheck = await db.collection('users').findOne({ email: email.toLowerCase() });
      if (authCheck.isAdminVerified) {
        next();
      } else {
        throw new ErrorHandler(
          403,
          'Verify Yourself Using Institute Id or Wait For Admin Approval!'
        );
      }
    } catch (err) {
      next(err);
    }
  };
};
