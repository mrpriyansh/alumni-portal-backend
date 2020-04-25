const { ObjectID } = require('mongodb');
module.exports= async(req,res,db,client)=>{
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
      next();
  } else {
      console.log("The transaction was intentionally aborted.");
  }
  } catch(e){
    console.log("The transaction was aborted due to an unexpected error: " + e);

  } finally {
    await session.endSession();
  }
    }
