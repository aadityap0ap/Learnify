const {Router} = require("express");
const {courseModel , purchaseModel} = require("../db");
const { userMiddleWare } = require("../middleware/userMiddleware");
const courseRouter = Router();

courseRouter.post("/purchase",userMiddleWare,async(req,res) => {
    const userId = req.userId;
    const courseId = req.body.courseId;

    await purchaseModel.create({
        userId,
        courseId
    })
    res.json({
        message : "Course Purchased !"
    })
})

courseRouter.get("/preview",async(req,res) => {
    const courses = await courseModel.find({});
    res.json({
        courses
    })
})


module.exports = {
    courseRouter : courseRouter
}