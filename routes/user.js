// const express = require("express");
// const Router = express.Router;
//this same thing can be done by this way also

const {Router} = require("express");
const userRouter = Router();
//Router() ..starts with capital letter but its still not a class it a function

userRouter.post("/signin",(req,res) => {

})

userRouter.post("/signup",(req,res) => {

})

userRouter.get("/purchases",(req,res) => {

})

module.exports ={
    userRouter : userRouter
}