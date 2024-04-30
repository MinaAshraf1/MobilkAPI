const express = require("express");
const multer = require("multer");

const productController = require("../controller/products.controller");
const {validation} = require("../middleware/validation");
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
        const fileName = `product-${Date.now()}-${Math.round(Math.random() * 1E9)}.${ext}`;
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

router.route('/')
            .get(productController.getAllProducts)
            .post(verifyToken, validation(), allowedTo(userRoles.ADMIN), upload.single('image'), productController.addProduct)

router.route('/recommended')
            .get(productController.recommended)

router.route("/:id")
            .get(productController.getProduct)
            .patch(verifyToken, allowedTo(userRoles.ADMIN), productController.updateProduct)
            .delete(verifyToken, allowedTo(userRoles.ADMIN), productController.deleteProduct)

module.exports = router;