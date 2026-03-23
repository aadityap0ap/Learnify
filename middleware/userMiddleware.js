const jwt = require("jsonwebtoken");
const {JWT_USER_PASSWORD } = require("../config");

function userMiddleWare(req,res,next){
    try{
    const token = res.headers.token;
    const decoded = jwt.verify(token,JWT_USER_PASSWORD);
    if(decoded){
        req.userId = decoded.id,
        next();
    }
}
catch(err){
    res.status(504).json({
        message : "You are not Signed in"
    })
}
}

module.exports = {
    userMiddleWare
}