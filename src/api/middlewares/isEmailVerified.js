module.exports= (db) =>{
 return async(req,res,next) =>{
    const { email } = req.body;
    const authCheck = await db.collection('users').findOne({ email });

    const {isEmailVerified}= authCheck||{};
    if(isEmailVerified)
    {
        next();
    }
    else{
        res.json("please verify your email first");
    }
 }
}