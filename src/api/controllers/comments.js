const { ObjectID } = require('mongodb');
module.exports= async (req,res,db) =>{
    const {comment}=req.body;
    const email=req.user.email;
    const user = await db.collection('users').findOne({ email });
    const userID=user._id
    var cmntID;
    //inserting comment in comment collection
    await db.collection('comments').insertOne({comment,userID,PostID:req.params.postID,timestamp:Date()});
     //updating users collection with commentID and postID in a comment array.
    await db.collection("comments").find().sort({_id:-1}).toArray(
        async (err , collection) => {
        if(err) throw err;
        cmntID=collection[0]._id;
        
    await db.collection('users').updateOne({_id:userID},{
        $push: { comments: { "commentID" : collection[0]._id, "postID":req.params.postID } }});

         //updating posts collection with inserting an array postComments which contain all the posts commentID's .
    await db.collection('posts').updateOne({_id: ObjectID(req.params.postID)},{$push: {postCommentsIDs:  cmntID  }});
    });
    
    
}