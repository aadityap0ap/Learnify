const {Router} = require("express");
const adminRouter = Router();
const {adminModel, courseModel} = require("../db");
const {adminSchema} = require("../validations/adminValidator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");
const { adminMiddleware } = require("../middleware/adminMiddleware");


adminRouter.post("/signup",async (req,res) => {
    try{
    const result = adminSchema.safeParse(req.body);
    if(!result.success){
        return res.status(404).json({
            message :"Invalid Input",
            error : result.error.issues
        })
    }
    const {email,password,firstName,lastName} = result.data;
    const hashedPassword = await bcrypt.hash(password,10);
    await adminModel.create({
        email : email,
        password : hashedPassword,
        firstName : firstName,
        lastName : lastName
    })
    res.json({
        message : "Admin SignUp SuccessFul !"
    })
    }
    catch(err){
        res.status(500).json({
            message : "Something Went Wrong !",
            error : err.message
        })
    }
})

adminRouter.post("/signin",async (req,res) => {
    try{
        const{email,password} = req.body;
        const user = await adminModel.findOne({email});
        if(!user){
            return res.status(404).json({
                message : "User Not Found"
            });
        }
        const isMatched = await bcrypt.compare(password,user.password);
        if(!isMatched){
            return res.status(403).json({
                message : "Incorrect Password !"
            });
        }
        const token = jwt.sign({
            id : user._id
        },JWT_ADMIN_PASSWORD)
        res.json({
            token : token
        })
    }
    catch(err){
        res.status(500).json({
            message : 'Something Went Wrong !'
        })
    }
})

adminRouter.post("/addCourse",adminMiddleware,async(req,res) => {
    
    const adminId = req.userId;

    const {title,description,price,imageUrl} = req.body;
    const course = await courseModel.create({
        title : title,
        description : description,
        price : price,
        imageUrl : imageUrl,
        creatorId : adminId
    })
    res.json({
        message : "Course Created",
        courseId : course._id
    })
})

adminRouter.put("/updateCourse",adminMiddleware,async(req,res) => {
    const adminId = req.userId;
    const {title,description,price,imageUrl,courseId} = req.body;
    const course = await courseModel.findOneAndUpdate({
        _id : courseId,
        creatorId : adminId
    },
    {
        title ,
        description,
        price ,
        imageUrl 
    },
{
    new : true
})
    res.json({
        message : "Course Updated !",
        courseId : course._id
    })
})

adminRouter.get("/course/bulk",adminMiddleware,async(req,res) => {
    const adminId = req.userId;
    const courses = await courseModel.find({
        creatorId : adminId
    })
    res.json({
        courses
    })
})

module.exports ={
    adminRouter : adminRouter
}