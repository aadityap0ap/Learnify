// const express = require("express");
// const Router = express.Router;
//this same thing can be done by this way also

const {Router} = require("express");
const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config");
const {userModel, courseModel, purchaseModel} = require("../db");
const bcrypt = require("bcrypt"); 
const { userSchema } = require("../validations/userValidator");
const { userMiddleWare } = require("../middleware/userMiddleware");
const userRouter = Router();
//Router() ..starts with capital letter but its still not a class it a function

userRouter.post("/signup",async (req,res) => {
    try{
        //zod validation
        const result = userSchema.safeParse(req.body);
        if(!result.success){
            return res.status(400).json({
                message:"Invalid Inputs",
                error : result.error.issues
            });
        }
        //now use validated date not req.body
        const {email,password,firstName,lastName} = result.data;

        //hashing the password
        const hashedPassword = await bcrypt.hash(password, 10);
        await userModel.create({
            email,
            password : hashedPassword,
            firstName,
            lastName,
        });
        res.json({
            message:"Signup Successful"
        })
    }
    catch(err){
        res.status(500).json({
            message : "Something Went wrong",
            error : err.message
        });
    }
});

userRouter.post("/signin",async (req,res) => {
    // const {email,password} = req.body;
    // const user = await userModel.find({
    //     email : email,
    //     password : password
    // })
    // if(user){
    //     const token = jwt.sign({
    //         id : user._id,
    //     },JWT_USER_PASSWORD);
    //     res.body({
    //         token : token
    //     })
    // }
    // else{
    //     res.status(403).json({
    //         message:"User Credentials Wrong !"
    //     })
    // }
    //the above is a normal end point does not comapring the normal password with hashed password
    try{
    const {email,password} = req.body;
    const user = await userModel.findOne({email});
    if(!user){
        return res.status(404).json({
            message : "User Not Found"
        });
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
       return  res.status(403).json({
            message : "Wrong Password !"
        });
    }
    const token = jwt.sign({
        id : user._id,
    },JWT_USER_PASSWORD);
    res.json({
        token : token
    })
    }
    catch(err){
        return res.status(500).json({
            message : "SomeThing Went Wrong !"
        })
    }
})

userRouter.get("/purchases",userMiddleWare,async(req,res) => {
    const userId = req.userId;
    const Purchases = purchaseModel.find({
        userId
    })
    res.json({
        Purchases
    })
})

module.exports ={
    userRouter : userRouter
}