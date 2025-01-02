const {Router}=require("express");
const courseRouter=Router();
const {userAuth}=require("../middlewares/user");
const { purchaseModel } = require("../db");

// PURCHASED COURSE
courseRouter.post("/purchase",userAuth,async (req,res)=>{
    const userId=req.userId;
    const {courseId}=req.body;

    await purchaseModel.create({
        courseId:courseId,
        userId:userId
    })
    res.json({msg:"Purchase successfull!"});
});

// SEE ALL COURSE
courseRouter.get("/preview",async (req,res)=>{
    const courses=await courseModel.find({});

    res.json({
        courses:courses,
        msg:"Fetch all successfull!"
    });
});

module.exports={
    courseRouter:courseRouter
}