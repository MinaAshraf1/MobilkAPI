const jwt = require("jsonwebtoken");

const appError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");


const verifyToken = (req, res, next) => {
    const authHeader = req.headers['Authorization'] || req.headers['authorization'];

    if(!authHeader) {
        return next(appError.create("token is required", 401, httpStatusText.ERROR));
    }

    const token = authHeader.split(' ')[1];

    try {
        // require('crypto').randomBytes(32).toString('hex')
        const decodedToken = jwt.verify(token, process.env.JWT_SECURE_KEY);
        req.token = decodedToken;
        next();
    } catch(e) {
        return next(appError.create(e, 401, httpStatusText.ERROR));
    }
}

module.exports = verifyToken;