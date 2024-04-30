const express = require("express");

const cartsController = require("../controller/carts.controller");
const verifyToken = require("../middleware/verifyToken");
const allowedTo = require("../middleware/allowedTo");
const userRoles = require("../utils/userRoles");


const router = express.Router();

router.route('/:id')
            .post(verifyToken, cartsController.addToCart)
            .get(verifyToken, cartsController.getCart)
            .delete(verifyToken, cartsController.deleteFromCart)

module.exports = router;