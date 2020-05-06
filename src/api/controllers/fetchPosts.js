const { ObjectId } = require('mongodb');

module.exports = async (req, res, db) => {
  // eslint-disable-next-line radix
  const offset = parseInt(req.query.offset || 0);
  const pageSize = 5;
  const { id } = req.params;
  const { type } = req.query;
  if (id === 'ALL') {
    // eslint-disable-next-line prettier/prettier
    const posts = await db.collection('posts').find({type}).skip(offset).limit(pageSize).sort([['_id',-1]]).toArray();
    const size = await db.collection('posts').countDocuments({ type });
    const count = size === offset + posts.length ? null : offset + posts.length;
    res.status(200).json({ offset: count, posts });
  } else {
    // eslint-disable-next-line prettier/prettier
    const posts = await db.collection('posts').find({ID: ObjectId(id), type}).skip(offset).limit(pageSize).sort([['_id',-1]]).toArray();
    const size = await db.collection('posts').countDocuments({ type, id });
    const count = size === offset + posts.length ? null : offset + posts.length;
    res.status(200).json({ offset: count, posts });
  }
};
