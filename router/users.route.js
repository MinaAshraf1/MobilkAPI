const express = require("express");
const multer = require("multer");

const userController = require("../controller/users.controller");
const verifyToken = require("../middleware/verifyToken");
const allowedTo = require("../middleware/allowedTo");
const userRoles = require("../utils/userRoles");


const diskStorge = multer.diskStorage({
    destination: function(req, file, callBack) {
        // console.log(file);
        callBack(null, 'images')
    },
    filename: function(req, file, callBack) {
        const ext = file.mimetype.split('/')[1];
        const fileName = `user-${Date.now()}-${Math.round(Math.random() * 1E9)}.${ext}`;
        callBack(null, fileName);
    }
})

const fileFilter = (req, file, callBack) => {
    const imgType = file.mimetype.split('/')[0];
    if(imgType == 'image') {
        return callBack(null, true);
    } else {
        return callBack(appError.create('file must be an image', 400));
    }
}

const upload = multer({storage: diskStorge, fileFilter: fileFilter});

const router = express.Router();

router.route("/")
            .get(verifyToken, allowedTo(userRoles.ADMIN), userController.getAllUsers)

router.route("/register")
            .post(upload.single('avatar'), userController.register)

router.route("/login")
            .post(userController.login)

module.exports = router;