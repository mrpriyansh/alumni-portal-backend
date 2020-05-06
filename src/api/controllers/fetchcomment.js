module.exports = async (req, res, db) => {
  // eslint-disable-next-line radix
  const offset = parseInt(req.query.offset || 0);
  const pageSize = Math.max(1, offset);

  const comments = await db
    .collection('comments')
    .find({ postId: req.params.postId })
    .skip(offset)
    .limit(pageSize)
    .sort([['_id', -1]])
    .toArray();
  const size = await db.collection('comments').countDocuments({ postId: req.params.postId });
  const count = size === offset + comments.length ? null : offset + comments.length;
  res.status(200).json({ offset: count, comments });
};
