const jwt=require("jsonwebtoken")
require('dotenv').config()

const authentication=(req,res,next)=>{
    const token=req.headers.authorization?.split(" ")[1]
    if(!token){
        res.status(401).send({"Message":"Please login again"})
    }else{
        let docoded=jwt.verify(token,process.env.seckey)
        if(docoded){
            req.body.userID=docoded.userID
            next()
        }else{
            res.status(401).send({"Message":"Please login again"})
        }
    }
}
module.exports={
    authentication
}