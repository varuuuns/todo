const {Router}=require("express");
const userRouter=Router();
const {userModel,purchaseModel,courseModel}=require("../db");
const jwt=requie("jsonwebtoken");
const {JWT_USER_SECRET}=require("../config");
const {userAuth}=require("../middlewares/user");

// SIGNUP
userRouter.post("/signup",async (req,res)=>{
    const {email,password,firstName,lastName}=req.body;

    const exitingUser=await userModel.find({email:email});
    if(exitingUser!==null) return res.json({msg:"Existing user! Please login!"});

    const hashedPassword=await bcrypt.hash(password,5);

    userModel.create({
        email:email,
        password:hashedPassword,
        firstName:firstName,
        lastName:lastName
    });
    res.json({msg:"Signup successfull!"});
});

// LOGIN
userRouter.post("/login",async (req,res)=>{
    const {email,password}=req.body;

    const existingUser=await userModel.find({email:email});
    if(existingUser===null) return res.json({msg:"Please signup!"});

    const hashedPassword=bcrypt.compare(password,existingUser.hashedPassword);
    if(hashedPassword){
        const token=jwt.sign({
            id:existingUser._id
        },JWT_USER_SECRET);
        res.json({
            token:token,
            msg:"Login successfull!"
        })
    }
    else res.json({msg:"Incorrect password!"});
});

// SEES PURCHASED COURSES
userRouter.get("/purchases",userAuth,async (req,res)=>{
    const userId=req.id;

    const purchases=await purchaseModel.find({userId:userId});

    var purchaseId=[];
    for(let i=0;i<purchases.length;i++){
        purchaseId.push(purchases[i].courseId);
    }
    const purchasedCourses=await courseModel.find({_id:{$in: purchaseId}});

    res.json({
        courses:purchasedCourses,
        msg:"Fetch successfull!"
    });
});

module.exports={
    userRouter:userRouter
}