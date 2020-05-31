/* eslint-disable no-console */
const { ObjectID } = require('mongodb');

module.exports = async (req, res, db, client) => {
  const { userId, commentText, postId } = req.body;
  const session = client.startSession();
  const transactionOptions = {
    readPreference: 'primary',
    readConcern: { level: 'local' },
    writeConcern: { w: 'majority' },
  };
  try {
    const transactionResults = await session.withTransaction(async () => {
      // inserting comment in comment collection
      await db
        .collection('comments')
        .insertOne(
          { userId: ObjectID(userId), postId: ObjectID(postId), commentText, timestamp: Date() },
          { session }
        );
    }, transactionOptions);

    if (transactionResults) {
      res.status(200).json({ icon: 'success', title: 'Comment Successfull!' });
    } else {
      console.log('The transaction was intentionally aborted.');
    }
  } catch (e) {
    console.log(`The transaction was aborted due to an unexpected error: ${e}`);
  } finally {
    await session.endSession();
  }
};
