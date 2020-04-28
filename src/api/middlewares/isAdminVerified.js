module.exports = db => {
  return async (req, res, next) => {
    const { email } = req.body;
    const authCheck = await db.collection('users').findOne({ email });

    const { isAdminVerified } = authCheck;
    if (isAdminVerified) {
      next();
    } else {
      res
        .status(401)
        .json({ response: 'Verify yourself using Institute Id or Wait for admin Approval!' });
    }
  };
};
