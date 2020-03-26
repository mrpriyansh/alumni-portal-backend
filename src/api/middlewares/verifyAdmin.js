function needsDbParam(db) {
  return async function(req, res, next) {
    const { email } = req.body;
    const authCheck = await db.collection('users').findOne({ email });
    const { isAdmin } = authCheck;
    if (isAdmin) {
      next();
    } else {
      res.send('You are not an admin');
    }
  };
}
module.exports = needsDbParam;
