const bcrypt = require("bcryptjs");

const handleError = require("../middleware/handleError");
const Users = require("../models/users.model")
const httpStatusText = require("../utils/httpStatusText");
const appError = require("../utils/appError");
const genrateJWT = require("../utils/genrateJWT");

const getAllUsers = handleError(async (req, res, next) => {
    const users = await Users.find({}, {"__v": 0});
    res.status(200).json({"status": httpStatusText.SUCCESS, "data": {users}});
})

const register = handleError(async (req, res, next) => {
    const {firstName, lastName, email, password, role} = req.body;

    const oldUser = await Users.findOne({"email": email});

    if(oldUser) {
        return next(appError.create("User already exists", 400, httpStatusText.FAIL));
    }

    const hashedPassword = await  bcrypt.hash(password, 10);
    
    const newUser = new Users({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: role,
        avatar: req.file.filename
    })

    const token = await genrateJWT({"email": newUser.email, "id": newUser._id, "role": newUser.role});

    await newUser.save();

    res.status(201).json({"status": httpStatusText.SUCCESS, "data": {newUser}, "token": token});
})

const login = handleError(async (req, res, next) => {
    const {email, password} = req.body;

    if(!email || !password) {
        return next(appError.create("email and password are required", 400, httpStatusText.ERROR));
    }

    const user = await Users.findOne({"email": email});

    if(!user) {
        return next(appError.create("User Not Found", 404, httpStatusText.ERROR));
    } 
    
    const matchPassword = await bcrypt.compare(password, user.password);

    if(user && matchPassword) {
        const token = await genrateJWT({"email": user.email, "id": user.id, "role": user.role});
        res.status(200).json({"status": httpStatusText.SUCCESS, "token": token});
    } else if (!matchPassword) {
        return next(appError.create("Password is wrong", 400, httpStatusText.ERROR));
    }
})

module.exports = {
    getAllUsers,
    register,
    login
}