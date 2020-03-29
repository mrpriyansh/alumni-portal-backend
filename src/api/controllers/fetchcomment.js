const {ObjectId}=require('mongodb');
module.exports= async (req,res,db) =>{
    // const postcommentIDs=await db.collection('posts').find({_id:ObjectId(req.params.postID)}).project({postCommentsIDs:1,_id:0}).toArray();
    // let ans;
    // // const postComments=await postcommentIDs[0].postCommentsIDs.map(async (ID) =>{
    // //      return await db.collection('comments').find({_id:ObjectId(ID)}).project({comment:1,_id:0}).toArray();
    // //     });
    // let postComments=[];
    // postComments= await postcommentIDs[0].postCommentsIDs.forEach(async (ID) => {
    //     return await db.collection('comments').find({_id:ObjectId(ID)}).project({comment:1,_id:0}).toArray();
    // });
        
    // console.log(postComments);
    // // res.send(postComments);

    const comments=await db.collection('comments').find({PostID:req.params.postID}).project({_id:0,comment:1}).toArray();
    res.send(comments.comment);
}