const { ObjectID } = require('mongodb');
module.exports = async (req,res,db) =>{

    await db.collection("comments").find().sort({_id:-1}).toArray(
        async (err , collection) => {
        if(err) throw err;
       const cmntID=collection[0]._id;
    await db.collection('comments').updateOne({_id:ObjectID(req.params.commentID)}, { $push: {Replies:cmntID}});

    });
    res.status(200).send('success');
}