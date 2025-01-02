const mongoose=require("mongoose");
const schema=mongoose.Schema;
const ObjectId=mongoose.ObjectId;
const {MONGO_URL}=require("./config");

mongoose.connect(MONGO_URL);

const Admin=new schema({
    email:{type:String, unique:true},
    password:String,
    firstName:String,
    lastName:String
})

const User=new schema({
    email:{type:String, unique:true},
    password:String,
    firstName:String,
    lastName:String
})

const Course=new schema({
    title:String,
    description:String,
    price:Number,
    imageLink:String,
    creatorId:ObjectId
})

const Purchase=new schema({
    courseId:ObjectId,
    userId:ObjectId
})

const userModel=mongoose.model("user",User);
const adminModel=mongoose.model("admin",Admin);
const courseModel=mongoose.model("course",Course);
const purchaseModel=mongoose.model("purchase",Purchase);

module.exports={
    userModel,
    adminModel,
    courseModel,
    purchaseModel
}