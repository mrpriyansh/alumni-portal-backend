module.exports = async (req, res, db, client) => {
  const { text, type, url, fileUrls } = req.body;
  if (text.length === 0) res.status(400).json({ icon: 'error', title: `Post can't be empty!` });
  const session = client.startSession();
  const transactionOptions = {
    readPreference: 'primary',
    readConcern: { level: 'local' },
    writeConcern: { w: 'majority' },
  };
  try {
    const usersCollection = await db.collection('users');
    const postCollection = await db.collection('posts');

    const transactionResults = await session.withTransaction(async () => {
      const user = await usersCollection.findOne({ email: req.user.email }, { session });
      const ID = user._id;
      const userName = user.name;
      const { designation, company } = user;
      const POST = await postCollection.insertOne(
        { ID, userName, designation, company, text, type, url, fileUrls, timestamp: Date() },
        { session }
      );

      const postID = POST.insertedId;
      await usersCollection.updateOne(
        { email: req.user.email },
        { $push: { Posts: postID } },
        { session }
      );
    }, transactionOptions);

    if (transactionResults) {
      res.status(200).json({ icon: 'success', title: 'Your Post is Uploaded!' });
    } else {
      console.log('The transaction was intentionally aborted.');
    }
  } catch (err) {
    console.log(`The transaction was aborted due to an unexpected error: ${err}`);
  } finally {
    await session.endSession();
  }
};
