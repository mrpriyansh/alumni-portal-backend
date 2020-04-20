const { ObjectId } = require('mongodb');

module.exports = async (req, res, db) => {
  if (req.body.findAll === true) {
    // eslint-disable-next-line prettier/prettier
    const posts = await db.collection('posts').find( {type:req.body.type} ).sort([['_id',-1]]).toArray();
    res.status(200).json(posts);
  } else {
    // eslint-disable-next-line prettier/prettier
    const posts = await db.collection('posts').find({ID: ObjectId(req.body.userId), type:req.body.type}).toArray();
    res.status(200).json(posts);
  }
};