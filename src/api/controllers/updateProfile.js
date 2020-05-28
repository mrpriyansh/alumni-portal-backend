const updateProfile = async (req, res, db) => {
  try {
    const { data } = req.body;
    await db.collection('users').findOneAndUpdate({ email: req.user.email }, { $set: data });
    res.status(200).json({ icon: 'success', title: 'Updated!' });
  } catch (error) {
    res.status(500).json({ icon: 'error', title: 'Server Error! Please try later!' });
  }
};
module.exports = updateProfile;
