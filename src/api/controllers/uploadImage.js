const path = require('path');
const { v4 } = require('uuid');
const uploadImageUtility = require('../middlewares/storeCloud');

module.exports = async (req, res, db) => {
  try {
    const myFile = req.file;
    const user = await db.collection('users').findOne({ email: req.user.email });
    const uniqueID = v4();
    const fileName = `${user._id}/${uniqueID}${path.extname(myFile.originalname)}`;
    const imageUrl = await uploadImageUtility(myFile, fileName);
    res.status(200).json({
      message: 'Upload was successful',
      data: `${imageUrl}`,
      type: `${path.extname(myFile.originalname)}`,
    });
  } catch (error) {
    res.status(402).json('Cannot upload');
    // next(error);
  }
};
