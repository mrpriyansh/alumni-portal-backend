module.exports = async (req, res, db) => {
  // eslint-disable-next-line radix
  const offset = parseInt(req.query.offset || 0);
  const pageSize = 5;
  const { type } = req.query;
  const projection = {
    _id: 1,
    userId: 1,
    text: 1,
    type: 1,
    url: 1,
    fileUrls: 1,
    timestamp: 1,
    name: 1,
    profilePicUrl: 1,
    designation: 1,
    company: 1,
  };
  const posts = await db
    .collection('posts')
    .aggregate([
      { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'userDetails' } },
      {
        $replaceRoot: {
          newRoot: { $mergeObjects: [{ $arrayElemAt: ['$userDetails', 0] }, '$$ROOT'] },
        },
      },
      { $match: { type } },
      { $project: projection },
      { $sort: { _id: -1 } },
      { $skip: offset },
      { $limit: pageSize },
    ])
    .toArray();
  const size = await db.collection('posts').countDocuments({ type });
  const count = size === offset + posts.length ? null : offset + posts.length;
  res.status(200).json({ offset: count, posts });
};
