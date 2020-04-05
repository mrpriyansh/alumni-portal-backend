module.exports = async (req, res, db) => {
  const { text, type, imageUrl } = req.body;
  if (text.length === 0) res.status(400).json({ icon: 'error', title: `Post can't be empty!` });
  const user = await db.collection('users').findOne({ email: req.user.email });
  const ID = user._id;
  const userName = user.name;
  await db.collection('posts').insertOne({ ID, userName, text, type, imageUrl });

  db.collection('posts')
    .find()
    .sort({ _id: -1 })
    .toArray(async (err, collection) => {
      if (err) throw err;
      await db
        .collection('users')
        .updateOne({ email: req.user.email }, { $push: { Posts: collection[0]._id } });
    });
  res.status(200).json({ icon: 'success', title: 'Your Post is Uploaded!' });
};
