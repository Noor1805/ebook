const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { errorResponse } = require("../utils/errorHandler");

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            
            if (!token) {
                return errorResponse(
                    res,
                    401,
                    "Authentication token is missing. Please log in again."
                );
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            
            if (!req.user) {
                return errorResponse(
                    res,
                    401,
                    "User account not found. Please log in again."
                );
            }
            
            return next();
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return errorResponse(
                    res,
                    401,
                    "Your session has expired. Please log in again."
                );
            }
            if (error.name === "JsonWebTokenError") {
                return errorResponse(
                    res,
                    401,
                    "Invalid authentication token. Please log in again."
                );
            }
            return errorResponse(
                res,
                401,
                "Authentication failed. Please log in again."
            );
        }
    }

    return errorResponse(
        res,
        401,
        "Authentication required. Please log in to access this resource."
    );
};

module.exports = { protect };