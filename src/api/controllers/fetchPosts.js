const { ObjectId } = require('mongodb');

module.exports = async (req, res, db, client) => {
  const session = client.startSession();

  const transactionOptions = {
    readPreference: 'primary',
    readConcern: { level: 'local' },
    writeConcern: { w: 'majority' },
  };

  try {
    const transactionResults = await session.withTransaction(async () => {
      if (req.body.findAll === true) {
        // eslint-disable-next-line prettier/prettier
      const posts = await db.collection('posts').find( {type:req.body.type},{session}).sort([['_id',-1]]).toArray();
        res.status(200).json(posts);
      } else {
        // eslint-disable-next-line prettier/prettier
      const posts = await db.collection('posts').find({ID: ObjectId(req.body.userId), type:req.body.type},{session}).toArray();
        res.status(200).json(posts);
      }
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
