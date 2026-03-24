const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");

function adminMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                message: "No token provided"
            });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_ADMIN_PASSWORD);
        req.userId = decoded.id;
        next();

    } catch (err) {
        return res.status(403).json({
            message: "Invalid or expired token"
        });
    }
}

module.exports = {
    adminMiddleware
};

