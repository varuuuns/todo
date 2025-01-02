const jwt=require("jsonwebtoken");
const {JWT_USER_SECRET}=reuire("../config");

function authUser(){
    const token=req.headers.token;
    const decoded=jwt.verify(token,JWT_USER_SECRET);

    if(decoded){
        req.userId=decoded.id;
        next();
    }
    else{ res.status(403).json({msg:"Invalid token!"})};
}

module.exports={
    authUser
}