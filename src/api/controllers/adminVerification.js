const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

module.exports= async(req,res,db,client)=>{
  if(req.body.userType=='student')
  {
    const {token} = req.params;
    jwt.verify(token,process.env.TOKEN_ACCESS_SECRET,async(er,decoded)=>{
        if(er){
            res.status(401).send({message: er.message})
        }
        else{
            const userid=decoded.id;
            await db
               .collection('users')
               .findOneAndUpdate({ _id: ObjectID(userid) }, { $set: { isAdminVerified: true } });
               
            try {
              res.redirect('/api/login');
          } catch (error) {
              res.status(400).send(error)
          } 
        }     
    })

  }
  else{

    const session = client.startSession();
    
    const transactionOptions = {
      readPreference: 'primary',
      readConcern: { level: 'local' },
      writeConcern: { w: 'majority' }
  };

  try {
    const adminsCollection=await  db.collection('admins');
    const usersCollection=await db.collection('users');
    const transactionResults = await session.withTransaction(async () => {
      adminsCollection.updateOne({}, { $pull: { usersToVerify: ObjectID(req.params.userID) } }, { session });
      usersCollection.findOneAndUpdate({ _id: ObjectID(req.params.userID) }, { $set: { isAdminVerified: true } },{ session });

    }, transactionOptions);
   
    if (transactionResults) {
      res.send('user succesfully verified by admin');

  } else {
      console.log("The transaction was intentionally aborted.");
  }
  } catch(e){
    console.log("The transaction was aborted due to an unexpected error: " + e);

  } finally {
    await session.endSession();
  }

  }

}
