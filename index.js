const express=require("express");
const {userRouter}=require("./routes/user");
const {courseRouter}=require("./routes/course");
const {adminRouter}=require("./routes/admin");
const {MONGO_URL}=require("./config");
// const {userModel,adminModel,courseModel,purchaseModel}=require("./db");

const app=express();
app.use(express.json());

app.use("/v0/admin",adminRouter); // ADMIN ROUTES
app.use("/v0/user",userRouter); // USER ROUTES
app.use("/v0/course",courseRouter); // COURSE ROUTES

const port=3000;
async function main(){
    await mongoose.connect(MONGO_URL);
    app.listen(port,()=>console.log(`Port: ${port}`));
}

main()