const changeProfilePic = async (req, res, db) => {
  try {
    const { url } = req.body;
    await db
      .collection('users')
      .findOneAndUpdate({ email: req.user.email }, { $set: { profilePicUrl: url } });
    res.status(200).json({ icon: 'success', title: 'Profile Photo Updated!' });
  } catch (error) {
    res.status(500).json({ icon: 'error', title: 'Server Error! Please try later!' });
  }
};
module.exports = changeProfilePic;
