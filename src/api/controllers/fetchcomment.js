const { ObjectID } = require('mongodb');

module.exports = async (req, res, db) => {
  // eslint-disable-next-line radix
  const offset = parseInt(req.query.offset || 0);
  const pageSize = Math.max(1, offset);
  const projection = {
    _id: 1,
    commentText: 1,
    timestamp: 1,
    userId: 1,
    name: 1,
    profilePicUrl: 1,
  };

  const comments = await db
    .collection('comments')
    .aggregate([
      { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'userDetails' } },
      {
        $replaceRoot: {
          newRoot: { $mergeObjects: [{ $arrayElemAt: ['$userDetails', 0] }, '$$ROOT'] },
        },
      },
      { $match: { postId: ObjectID(req.params.postId) } },
      { $project: projection },
      { $sort: { _id: -1 } },
      { $skip: offset },
      { $limit: pageSize },
    ])
    .toArray();
  const size = await db
    .collection('comments')
    .countDocuments({ postId: ObjectID(req.params.postId) });
  const count = size === offset + comments.length ? null : offset + comments.length;
  // res.status(200).json(posts);
  res.status(200).json({ offset: count, comments });
};
