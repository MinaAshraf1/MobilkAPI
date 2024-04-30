const handleError = require("../middleware/handleError");
const Users = require("../models/users.model");
const Products = require("../models/products.model");
const Carts = require("../models/carts.model");
const appError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");

const addToCart = handleError(async (req, res, next) => {
    const userId = req.params.id;

    const user = await Users.findById(userId);

    if(!user) {
        return next(appError.create("User Not Defined", 400, httpStatusText.FAIL));
    }

    const productId = req.body.id;
    const product = await Products.findById(productId);

    if(!product) {
        return next(appError.create("Product Not Found", 400, httpStatusText.FAIL));
    }

    const cart = {
        "productId": product._id,
        "name": product.name,
        "price": product.price,
        "category": product.category,
        "quantity": 1,
        "image": product.image
    }

    const oldCart = await Carts.findOne({"userId": userId});

    if(oldCart) {
        const oldProduct = oldCart.cart.find(product => product.productId == productId);
        if(oldProduct) {
            const quantity = oldProduct.quantity + 1;
            cart.quantity = quantity;
            await Products.updateOne({"_id": productId}, {$set: {"quantity": product.quantity - 1}});
            const updatedCart = await Carts.updateOne({"userId": userId}, {$set: {"cart": {...cart}}});
            return res.status(201).json({"status": httpStatusText.SUCCESS, "data": {updatedCart}});
        } else {
            oldCart.cart.push(cart);
            await oldCart.save();
            await Products.updateOne({"_id": productId}, {$set: {"quantity": product.quantity - 1}});
            res.status(201).json({"status": httpStatusText.SUCCESS, "data": {oldCart}});
        }
    } else {
        const newCart = await new Carts({
            userId,
            cart: cart
        })
        await newCart.save();
        await Products.updateOne({"_id": productId}, {$set: {"quantity": product.quantity - 1}});
        res.status(201).json({"status": httpStatusText.SUCCESS, "data": {newCart}});
    }
})


const getCart = handleError(async (req, res, next) => {
    const userId = req.params.id;

    const cart = await Carts.find({"userId": userId});

    if(!cart) {
        return next(appError("cart empty", 400, httpStatusText.FAIL));
    }

    res.status(200).json({"status": httpStatusText.SUCCESS, "data": {cart}});
})

const deleteFromCart = handleError(async (req, res, next) => {
    const userId = req.params.id;
    const productId = req.body.id;

    const cart = await Carts.findOne({"userId": userId});
    
    if(!cart) {
        return next(appError("cart empty", 400, httpStatusText.FAIL));
    }

    const product = await Products.findById(productId);    
    const oldProduct = cart.cart.find(product => product.productId == productId);

    if(oldProduct && oldProduct.quantity > 1) {
        const quantity = oldProduct.quantity - 1;
        oldProduct.quantity = quantity;
        await Carts.updateOne({"userId": userId}, {$set: {"cart": {...oldProduct}}});
        await Products.updateOne({"_id": productId}, {$set: {"quantity": product.quantity + 1}});
        return res.status(200).json({"status": httpStatusText.SUCCESS, "data": null});
    }

    const newcart = cart.cart.filter(product => product.productId != productId);

    await Carts.updateOne({"userId": userId}, {$set: {"cart": {...newcart}}});
    await Products.updateOne({"_id": productId}, {$set: {"quantity": product.quantity + 1}});

    res.status(200).json({"status": httpStatusText.SUCCESS, "data": null});
})

module.exports = {
    addToCart,
    getCart,
    deleteFromCart
}