const jwt = require("jsonwebtoken");
const {JWT_USER_PASSWORD } = require("../config");

function userMiddleWare(req,res,next){
    const authHeader = req.header.authorization;
    try{
        if(!authHeader){
            return res.status(504).json({
                message : "No token provided !"
            })
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token,JWT_USER_PASSWORD);
        req.userId = decoded.id;
        next()
    }
    catch(err){
        res.status(504).json({
            message:"Token Expired Or Something Went Wrong"
        })
    }
}
module.exports = {
    userMiddleWare
}

/**
 * take auth header from the header.authorization
 * now check weather the user is giving authheader or not
 * if not then return with an error message no token provided,
 * now convert the authheader in in token format or “We split the Authorization header to separate the Bearer keyword from the actual JWT token.”
 * const token = authHeader.split(" ")[1];
 * now decode the token using jwt.verify
 * now give the decoded.id to req.userId
 * now call the next(),
 * 
 */