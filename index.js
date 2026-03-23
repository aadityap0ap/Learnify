require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const {userRouter} = require("./routes/user");
const {courseRouter} = require("./routes/course");
const {adminRouter} = require("./routes/admin")

const app = express();
app.use(express.json());

app.use("/admin",adminRouter);
app.use("/user",userRouter);
app.use("/course",courseRouter);

// mongoose.connect("mongodb+srv://********")

// app.listen(3000);
//there is an problem with this.we must await the database call..means the db connection is successful then olny startr the backend..other wise starting he backend will be of no use

//so this is the right way to do so

async function main(){
await mongoose.connect(process.env.MONGO_URL);
app.listen(3000);
console.log("Listening on Port 3000");
}

main();