const {ObjectId}=require('mongodb');
module.exports= async (req,res,db) =>{
    const comments=await db.collection('comments').find({PostID:req.params.postID}).project({_id:0,comment:1}).toArray();
    res.send(comments);
}
