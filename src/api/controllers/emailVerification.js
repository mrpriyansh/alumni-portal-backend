const jwt = require('jsonwebtoken');
const { ObjectID } = require('mongodb');

module.exports=  async(req,res,db) =>{
        const {token} = req.params;
    jwt.verify(token,process.env.TOKEN_ACCESS_SECRET,async(er,decoded)=>{
        if(er){
            res.status(401).send({message: er.message})
        }
        else{
            const userid=decoded.id;
            await db
               .collection('users')
               .findOneAndUpdate({ _id: ObjectID(userid) }, { $set: { isEmailVerified: true } });
               
            try {
              res.redirect('/api/login');
          } catch (error) {
              res.status(400).send(error)
          } 
        }     
    })
    
    }




