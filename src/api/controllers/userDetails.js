module.exports = async (req, res, db) => {
  const data = {
    name: 1,
    email: 1,
    phoneno: 1,
    hash: 0,
    batchName: 1,
    subBatch: 1,
    graduationYear: 1,
    dob: 1,
    userType: 1,
  };
  const user = await db.collection('users').findOne({ email: req.user.email }, data);
  res.status(200).json(user);
};
