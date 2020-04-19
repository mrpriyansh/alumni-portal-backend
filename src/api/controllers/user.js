module.exports = async (req, res, db) => {
  const user = await db
    .collection('users')
    .find({})
    .toArray();
  res.send(user);
};
