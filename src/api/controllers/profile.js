const { ObjectId } = require('mongodb');

module.exports = async (req, res, db) => {
  const data = { hash: 0, isAdminVerified: 0, isEmailVerified: 0, isAdmin: 0, dob: 0, userType: 0 };
  try {
    const { profileId } = req.params;
    // eslint-disable-next-line prettier/prettier
    const user = await db.collection('users').findOne({ _id: ObjectId(profileId) }, { projection: data });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json('Invalid user id');
  }
};
