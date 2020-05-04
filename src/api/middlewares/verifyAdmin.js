function needsDbParam(db) {
  // eslint-disable-next-line func-names
  return async function(req, res, next) {
    const { email } = req.user;
    const { queryType } = req.query;
    if (queryType === 'members') next();
    else {
      const authCheck = await db.collection('users').findOne({ email });
      const { isAdmin } = authCheck || {};

      if (isAdmin) {
        next();
      } else {
        res.send('You are not an admin');
      }
    }
  };
}
module.exports = needsDbParam;
