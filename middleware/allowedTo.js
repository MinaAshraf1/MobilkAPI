const appError = require("../utils/appError");

module.exports = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.token.role)) {
            const error = appError.create("Not Allowed for you", 401)
            return next(error);
        }
        next();
    }
}