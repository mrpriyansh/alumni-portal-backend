module.exports = async (req, res, db) => {
  const data = { hash: 0, isAdminVerified: 0, isEmailVerified: 0, isAdmin: 0, dob: 0, userType: 0 };
  // eslint-disable-next-line prettier/prettier
  const user = await db.collection('users').findOne( {email: req.user.email }, {projection: data} );
  res.status(200).json(user);
};
