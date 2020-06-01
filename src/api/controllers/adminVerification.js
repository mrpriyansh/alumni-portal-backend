const { ObjectID } = require('mongodb');

module.exports = async (req, res, db) => {
  try {
    await db
      .collection('users')
      .findOneAndUpdate({ _id: ObjectID(req.body.userId) }, { $set: { isAdminVerified: true } });
    res.status(200).json({ icon: 'success', title: 'User is verified!' });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    res.status(500).json({ icon: 'error', title: 'Server Error!' });
  }
};
