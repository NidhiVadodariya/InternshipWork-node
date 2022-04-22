const User = require('../models/user');
const jwt = require('jsonwebtoken');
const CustomError = require('../utils/customError');
const BigPromise = require('../middleware/bigPromise')

exports.isLoggedIn = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            throw new CustomError('Login first to access this page', 401);
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        res.send(error.message)
    }
}

exports.customRole = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.role)){
            return next(new CustomError("You are not allowed for this resours",403));
        }
        next();
    };
};


