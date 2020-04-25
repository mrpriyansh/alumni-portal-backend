module.exports = async (req, res, db) => {
  const { text, type, imageUrl } = req.body;
  if (text.length === 0) res.status(400).json({ icon: 'error', title: `Post can't be empty!` });
  const user = await db.collection('users').findOne({ email: req.user.email });
  const ID = user._id;
  const userName = user.name;
  let POST= await db.collection('posts').insertOne({ ID, userName, text, type, imageUrl });
  
  let postID=POST.insertedId;

  await db
        .collection('users')
        .updateOne({ email: req.user.email }, { $push: { Posts: postID } });
        
  res.status(200).json({ icon: 'success', title: 'Your Post is Uploaded!' });
};
