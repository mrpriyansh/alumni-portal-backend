const { ObjectID } = require('mongodb');

module.exports = async (req, res, db, client) => {
  const { comment } = req.body;
  const { email } = req.user;
  const user = await db.collection('users').findOne({ email });
  const userID = user._id;
  let cmntID;

  const session = client.startSession();
  const transactionOptions = {
    readPreference: 'primary',
    readConcern: { level: 'local' },
    writeConcern: { w: 1 },
  };

  try {
    const transactionResults = await session.withTransaction(async () => {
      // inserting comment in comment collection
      await db
        .collection('comments')
        .insertOne({ comment, userID, PostID: req.params.postID, timestamp: Date() }, { session });
      // updating users collection with commentID and postID in a comment array.
      await db
        .collection('comments')
        .find({ session })
        .sort({ _id: -1 })
        .toArray(async (err, collection) => {
          if (err) throw err;
          cmntID = collection[0]._id;

          await db.collection('users').updateOne(
            { _id: userID },
            {
              $push: { comments: { commentID: collection[0]._id, postID: req.params.postID } },
            },
            { session }
          );

          // updating posts collection with inserting an array postComments which contain all the posts commentID's .
          await db
            .collection('posts')
            .updateOne(
              { _id: ObjectID(req.params.postID) },
              { $push: { postCommentsIDs: cmntID } },
              { session }
            );
        });
    }, transactionOptions);

    if (transactionResults) {
      console.log('The transaction was successfull');
    } else {
      console.log('The transaction was intentionally aborted.');
    }
  } catch (e) {
    console.log(`The transaction was aborted due to an unexpected error: ${e}`);
  } finally {
    await session.endSession();
  }
};
