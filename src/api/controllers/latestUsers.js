module.exports = async (req, res, db) => {
  try {
    const latestUsers = await db
      .collection('users')
      .find({})
      .sort({ _id: -1 })
      .limit(3)
      .project({ name: 1, profilePicUrl: 1, admissionYear: 1, batchName: 1, subBatch: 1 })
      .toArray();
    res.status(200).json(latestUsers);
  } catch (err) {
    console.log(err);
  }
};
