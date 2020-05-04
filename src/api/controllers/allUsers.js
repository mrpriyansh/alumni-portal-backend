module.exports = async (req, res, db) => {
  const { queryType, admissionYear } = req.query;
  if (queryType === 'members') {
    const users = await db
      .collection('users')
      .find({ admissionYear, isAdminVerified: true, isEmailVerified: true })
      .sort({ name: 1 })
      .toArray();
    res.status(200).json(users);
  } else {
    const toBeVerified = await db
      .collection('users')
      .find({ isAdminVerified: false })
      .sort([['_id', -1]])
      .toArray();
    res.status(200).json(toBeVerified);
  }
};
