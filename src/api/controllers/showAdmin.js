module.exports = async (req, res, db) => {
  const userToBeVerifiedID = await db
    .collection('admins')
    .find({})
    .toArray();
  const users = await db
    .collection('users')
    .find({})
    .toArray();
  const userToBeVerified = users.filter(user =>
    userToBeVerifiedID[0].usersToVerify.toString().includes(user._id)
  );
  res.status(200).send(userToBeVerified);
};
