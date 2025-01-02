const {Router}=require("express");
const adminRouter=Router();
const {adminModel}=require("../db");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const {JWT_ADMIN_SECRET}=require("../config");
const {authAdmin}=require("../middlewares/admin");
const {courseModel}=require("../db")

// have to add "ZOD"

// SIGNUP
adminRouter.post("/signup",async (req,res)=>{
    const {email,password,firstName,lastName}=req.body;
    
    const existingAdmin=adminModel.find({email:email});
    if(existingAdmin!==null) return res.json({msg:"Existing admin! Please login!"});

    const hashedPassword=await bcrypt.hash(password,5);

    await adminModel.create({
        email:email,
        password:hashedPassword,
        firstName:firstName,
        lastName:lastName
    })

    res.json({msg:"Signup successfull!"});
})

// LOGIN
adminRouter.post("/login",async (req,res)=>{
    const {email,password}=req.body

    const existingAdmin=await adminModel.find({email:email});
    if(existingAdmin===null) return res.json({msg:"Please signup!"});

    const hashedPassword=bcrypt.compare(password,existingAdmin.hashedPassword);
    if(hashedPassword){
        const token=jwt.sign({
            id:existingAdmin._id
        },JWT_ADMIN_SECRET);
        res.json({
            token:token,
            msg:"Login successfull!"
        })
    }
    else res.json({msg:"Incorrect password!"});
});

// CREATE COURSE
adminRouter.post("/course",authAdmin,async (req,res)=>{
    const adminId=req.adminId;
    const {title,description,price,imageLink}=req.body;

    const course=await courseModel.create({
        title:title,
        description:description,
        price:price,
        imageLink:imageLink,
        creatorId:adminId
    })

    res.json({
        couseId:course._id,
        msg:"Created course successfully!"
    });
})

// EDIT COURSE
adminRouter.put("/course",authAdmin,async (req,res)=>{
    const adminId=req.adminId;
    const {title,description,price,imageLink,courseId}=req.body;

    await courseModel.findByIdAndUpdate({courseId},
        {
        title:title,
        description:description,
        price:price,
        imageLink:imageLink,
        creatorId:adminId
    })

    res.json({msg:"Updated course succcessfully!"});
})

// SEES HIS COURSE
adminRouter.get("/course/mine",authAdmin,async (req,res)=>{
    const adminId=req.id;

    const myCourses=await courseModel.find({creatorId:adminId});

    res.json({
        courses:myCourses,
        msg:"Fetch successfully!"
    });
})

// SEES ALL COURSES
adminRouter.get("/course/all",authAdmin,async (req,res)=>{
    const allCourses=await courseModel.find();
    
    res.json({
        courses:allCourses,
        msg:"Fetched all courses successfully!"
    });
})

module.exports={
    adminRouter:adminRouter
}