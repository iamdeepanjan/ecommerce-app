const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // Validation error
    if (err.name === "ValidationError") {
        err.statusCode = 400;
        err.message = Object.values(err.errors).map((value) => value.message).join(", ");
    }

    // Wrong mongodb id error
    if (err.name === "CastError") {
        err.statusCode = 400;
        err.message = `No resource found with id: ${err.value}`;
    }

    // Duplicate key error
    if (err.code === 11000) {
        err.statusCode = 400;
        err.message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    }

    // JWT error
    if (err.name === "JsonWebTokenError") {
        err.statusCode = 401;
        err.message = "Invalid token";
    }

    // JWT expire error
    if (err.name === "TokenExpiredError") {
        err.statusCode = 401;
        err.message = "Token expired";
    }
    
    res.status(err.statusCode).json({
        success: false,
        statusCode: err.statusCode,
        message: err.message,
    });
};